import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import {
  NotificationChannel,
  NotificationType,
} from 'src/notifications/dto/create-notification.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationsService,
  ) {}

  async createFeedback(createFeedbackDto: CreateFeedbackDto) {
    if (
      !createFeedbackDto.userId ||
      !createFeedbackDto.appointmentId ||
      !createFeedbackDto.comment
    ) {
      throw new NotFoundException(
        'User ID, Appointment ID, and feedback are required',
      );
    }
    const isAlreadyExists = await this.prismaService.feedback.findUnique({
      where: {
        appointmentId: createFeedbackDto.appointmentId,
        userId: createFeedbackDto.userId,
      },
    });
    if (isAlreadyExists) {
      throw new NotFoundException(
        'You have already submitted feedback for this appointment',
      );
    }
    await this.notificationService.create({
      userId: createFeedbackDto.userId,
      title: 'Feedback Submitted',
      channel: NotificationChannel.IN_APP,
      type: NotificationType.SYSTEM_ALERT,
      message: `Thank you for your feedback on appointment ${createFeedbackDto.appointmentId}`,
    });
    return await this.prismaService.feedback.create({
      data: createFeedbackDto,
    });
  }

  async getFeedbackByAppointmentId(appointmentId: string) {
    if (!appointmentId) {
      throw new NotFoundException('Appointment ID is required');
    }

    const feedbacks = await this.prismaService.feedback.findMany({
      where: { appointmentId: appointmentId },
    });

    console.log('Feedbacks found:', feedbacks);

    if (!feedbacks) {
      throw new NotFoundException(
        'Feedbacks not found for the given appointment',
      );
    }

    return feedbacks;
  }
}
