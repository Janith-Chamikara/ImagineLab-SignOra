import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('create')
  async createFeedbackHandler(@Body() createFeedbackDto: CreateFeedbackDto) {
    return await this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Get('by-appointment-id')
  async getFeedbackByAppointmentIdHandler(
    @Query('appointmentId') appointmentId: string,
  ) {
    console.log('Fetching feedback for appointment:', appointmentId);
    return await this.feedbackService.getFeedbackByAppointmentId(appointmentId);
  }
}
