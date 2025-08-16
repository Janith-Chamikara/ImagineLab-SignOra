import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Appointment, AppointmentStatus, Prisma} from '@prisma/client';
import { randomUUID } from 'crypto';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
import { NotificationType, NotificationChannel } from '../notifications/dto/create-notification.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}


  private async findAvailableOfficer(
  departmentId: string,
  appointmentDate: Date,
  currentOfficerId?: string
) {
  const officers = await this.prisma.officer.findMany({
    where: {
      departmentId,
      isActive: true,
      id: { not: currentOfficerId }
    },
    include: {
      _count: {
        select: {
          managedAppointments: {
            where: {
              appointmentDate: {
                gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
                lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
              }
            }
          }
        }
      },
      managedAppointments: {
        where: {
          appointmentDate: {
            gte: new Date(appointmentDate.getTime() - 30 * 60 * 1000),
            lt: new Date(appointmentDate.getTime() + 30 * 60 * 1000)
          },
          status: {
            notIn: ['CANCELLED', 'COMPLETED']
          }
        }
      }
    }
  });

  const availableOfficers = officers.filter(
    officer => officer.managedAppointments.length === 0
  );

  if (availableOfficers.length === 0) {
    // Fallback to least busy officer
    return officers.sort((a, b) => 
      a._count.managedAppointments - b._count.managedAppointments
    )[0];
  }

  return availableOfficers.sort((a, b) => 
    a._count.managedAppointments - b._count.managedAppointments
  )[0];
}

  private mapToAppointmentResponse(appointment: any): AppointmentResponseDto {
    return {
      id: appointment.id,
      bookingReference: appointment.bookingReference,
      qrCode: appointment.qrCode,
      status: appointment.status,
      appointmentDate: appointment.appointmentDate,
      user: appointment.user,
      service: appointment.service,
      timeSlot: appointment.timeSlot,
      officer: appointment.officer,
    };
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AppointmentWhereUniqueInput;
    where?: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput;
  }): Promise<AppointmentResponseDto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const appointments = await this.prisma.appointment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        user: true,
        service: {
          include: {
            department: true,
          },
        },
        timeSlot: true,
        officer: true,
      },
    });

    return appointments.map(this.mapToAppointmentResponse);
  }

  async bookAppointment(
    createAppointmentDto: CreateAppointmentDto
  ): Promise<AppointmentResponseDto> {
    const { userId, serviceId, timeSlotId } = createAppointmentDto;
    
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const service = await prisma.service.findUnique({ 
        where: { id: serviceId },
        include: { department: true }
      });
      const timeSlot = await prisma.timeSlot.findUnique({ 
        where: { id: timeSlotId },
        include: { department: true }
      });

      const officer = await this.findAvailableOfficer(
      service.departmentId,
      timeSlot.startTime
      );

      if (!user) throw new NotFoundException('User not found');
      if (!service) throw new NotFoundException('Service not found');
      if (!timeSlot) throw new NotFoundException('Time slot not found');
      if (timeSlot.currentBookings >= timeSlot.maxBookings) {
        throw new NotFoundException('Time slot is fully booked');
      }
      if (!officer) {throw new Error(
        'Currently no officers available. Please try a different time slot or check back later.'
      );

    }

      const availableOfficers = await prisma.officer.findMany({
        where: {
          departmentId: service.departmentId,
          isActive: true,
        },
        include: {
          managedAppointments: {
            where: {
              appointmentDate: timeSlot.startTime,
            },
          },
        },
      });

      const availableOfficer = availableOfficers.find(
        officer => officer.managedAppointments.length === 0
      );

      if (!availableOfficer) {
        throw new NotFoundException('No available officers for selected time slot');
      }

      const appointment = await prisma.appointment.create({
        data: {
          bookingReference: `A${randomUUID().replace(/-/g, '').substring(0, 9)}`,
          qrCode: randomUUID(),
          userId,
          serviceId,
          timeSlotId,
          officerId: availableOfficer.id,
          status: 'CONFIRMED',
          appointmentDate: timeSlot.startTime,
        },
        include: {
          user: true,
          service: {
            include: {
              department: true,
            },
          },
          timeSlot: true,
          officer: true,
        },
      });

      await prisma.timeSlot.update({
        where: { id: timeSlotId },
        data: { currentBookings: timeSlot.currentBookings + 1 },
      });

      //TODO: Create notification for user


      
      return this.mapToAppointmentResponse(appointment);
    });
  }


    async getAvailableTimeSlots(query: AvailableSlotsQueryDto) {
    // First validate that serviceId exists
    if (!query.serviceId) {
      throw new BadRequestException('Service ID is required');
    }

    const { serviceId, startDate, endDate } = query;
    
    // Find the service with proper error handling
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: { department: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Set default date ranges if not provided
    const defaultStartDate = startDate || new Date();
    const defaultEndDate = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return this.prisma.timeSlot.findMany({
      where: {
        departmentId: service.departmentId,
        date: {
          gte: defaultStartDate,
          lte: defaultEndDate,
        },
        currentBookings: {
          lt: this.prisma.timeSlot.fields.maxBookings,
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async completeAppointment(
    appointmentId: string
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: {
        user: true,
        service: {
          include: {
            department: true,
          },
        },
        timeSlot: true,
        officer: true,
      },
    });
    return this.mapToAppointmentResponse(appointment);
  }


async updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
  officerId?: string
): Promise<AppointmentResponseDto> {
  // Get current appointment first for validation
  const currentAppointment = await this.prisma.appointment.findUnique({
    where: { id: appointmentId }
  });

  if (!currentAppointment) {
    throw new NotFoundException('Appointment not found');
  }

  // Validate status transition
  this.validateStatusTransition(currentAppointment.status, status);

  const data: Prisma.AppointmentUpdateInput = { status };
  
  // Assign officer if transitioning to IN_PROGRESS
  if (status === 'IN_PROGRESS' && officerId) {
    data.officer = { connect: { id: officerId } };
  }

  // Set completedAt if status is COMPLETED
  if (status === 'COMPLETED') {
    data.completedAt = new Date();
  }

  const appointment = await this.prisma.appointment.update({
    where: { id: appointmentId },
    data,
    include: {
      user: true,
      service: { include: { department: true } },
      timeSlot: true,
      officer: true,
    },
  });

  return this.mapToAppointmentResponse(appointment);
}

private validateStatusTransition(currentStatus: AppointmentStatus, newStatus: AppointmentStatus) {
  const allowedTransitions = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
    NO_SHOW: [],
  };

  if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
    throw new BadRequestException(
      `Invalid status transition from ${currentStatus} to ${newStatus}`
    );
  }
}


}