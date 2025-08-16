import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentService } from './appointment.service';
import { AppointmentStatus } from '@prisma/client';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('documents')) // 'documents' matches the frontend field name
  async createAppointmentHandler(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('Creating appointment with data');
    return await this.appointmentService.createAppointment(
      createAppointmentDto,
      files,
    );
  }

  @Get('get-all')
  async getAppointmentsHandler(@Query('userId') userId: string) {
    return await this.appointmentService.getAppointmentsByUserId(userId);
  }

  @Get('get-all-for-officer')
  async getAppointmentsForOfficerHandler(
    @Query('departmentId') departmentId: string,
  ) {
    return await this.appointmentService.getAppointmentsForOfficer(
      departmentId,
    );
  }
  @Put('update-status')
  async updateStatusHandler(
    @Query('appointmentId') appointmentId: string,
    @Query('status') status: AppointmentStatus,
    @Query('officerId') officerId: string,
  ) {
    console.log(appointmentId, status, officerId);
    return await this.appointmentService.updateStatus(
      appointmentId,
      status,
      officerId,
    );
  }
  @Get('get-single')
  async getAppointmentInfoHandler(
    @Query('appointmentId') appointmentId: string,
  ) {
    return await this.appointmentService.getAppointmentById(appointmentId);
  }
}
