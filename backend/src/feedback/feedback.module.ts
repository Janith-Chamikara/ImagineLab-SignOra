import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, PrismaService, NotificationsService],
})
export class FeedbackModule {}
