import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

import { AppointmentStatus, DocumentType } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';

import {
  NotificationChannel,
  NotificationType,
} from 'src/notifications/dto/create-notification.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
    files: Express.Multer.File[],
  ) {
    try {
      const result = await this.prismaService.$transaction(
        async (prisma) => {
          // Create the appointment first
          const appointment = await prisma.appointment.create({
            data: {
              appointmentDate: createAppointmentDto.appointmentDate,
              userId: createAppointmentDto.userId,
              serviceId: createAppointmentDto.serviceId,
              timeSlotId: createAppointmentDto.timeSlotId,
              status: createAppointmentDto.status,
              notes: createAppointmentDto.notes,
              officerId: createAppointmentDto.officerId,
            },
          });

          if (files && files.length > 0) {
            const documentPromises = files.map(async (file) => {
              // Upload to Cloudinary
              const uploadResult = await this.cloudinaryService.uploadBuffer(
                file.buffer,
                file.originalname,
                {
                  folder: `appointments/${appointment.id}`,
                  resource_type: 'auto',
                },
              );

              // Create document record in database
              return prisma.document.create({
                data: {
                  userId: createAppointmentDto.userId,
                  appointmentId: appointment.id,
                  fileName: uploadResult.public_id,
                  originalName: file.originalname,
                  fileSize: file.size,
                  mimeType: file.mimetype,
                  filePath: uploadResult.secure_url,
                  documentType: DocumentType.OTHER,
                  uploadedAt: new Date(),
                },
              });
            });

            await Promise.all(documentPromises);
          }

          const createdAppointment = await prisma.appointment.findUnique({
            where: { id: appointment.id },
            include: {
              documents: true,
              user: true,
              service: true,
              timeSlot: true,
            },
          });

          return createdAppointment;
        },
        {
          timeout: 60000, // 60 seconds
          maxWait: 60000, // Increased maxWait to match timeout
        },
      );

      try {
        await this.notificationsService.create({
          userId: createAppointmentDto.userId,
          title: `New Appointment Created `,
          message: `Your appointment has been successfully created for ${result.service.name}`,
          type: NotificationType.SYSTEM_ALERT,
          channel: NotificationChannel.IN_APP,
        });
      } catch (notificationError) {
        console.log('Failed to create notification:', notificationError);
      }

      return result;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Failed to create appointment with documents',
      );
    }
  }

  async getAppointmentsByUserId(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return await this.prismaService.appointment.findMany({
      where: { userId: userId },
      include: {
        documents: true,
        service: true,
        timeSlot: true,
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }
  async getAppointmentsForOfficer(departmentId: string) {
    if (!departmentId) {
      throw new BadRequestException('Department ID is required');
    }
    console.log('Fetching appointments for department:', departmentId);
    return await this.prismaService.appointment.findMany({
      include: {
        documents: true,
        user: true,
        service: true,
        timeSlot: true,
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }
  async getAppointmentById(appointmentId: string) {
    if (!appointmentId) {
      throw new BadRequestException('Appointment ID is required');
    }

    const appointment = await this.prismaService.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        documents: true,
        user: true,
        service: true,
        timeSlot: true,
      },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    return appointment;
  }

  async updateStatus(
    appointmentId: string,
    status: AppointmentStatus,
    officerId: string,
  ) {
    const isOfficerExists = await this.prismaService.officer.findUnique({
      where: { id: officerId },
    });
    if (!isOfficerExists) {
      throw new BadRequestException('Incorrect officer ID');
    }

    if (!appointmentId) {
      throw new BadRequestException('Appointment ID is required');
    }

    const appointment = await this.prismaService.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    await this.prismaService.notification.create({
      data: {
        userId: appointment.userId,
        title: `Appointment Status Updated`,
        message: `Your appointment-${appointment.id} status has been updated to ${status}`,
        type: NotificationType.SYSTEM_ALERT,
        channel: NotificationChannel.IN_APP,
      },
    });

    return await this.prismaService.appointment.update({
      where: { id: appointmentId },
      data: { status: status },
    });
  }
}
