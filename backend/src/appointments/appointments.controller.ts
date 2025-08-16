import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Put,
  UseGuards,


} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { AppointmentStatus } from '@prisma/client';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('appointments')
@UseGuards(JwtGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

@Get()
async findAll(
  @Query('skip') skip: string,
  @Query('take') take: string,
  @Query('status') status: string,
): Promise<AppointmentResponseDto[]> {
  // Validate status against enum values
  let statusFilter: AppointmentStatus | undefined;
  if (status) {
    if (!Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
      throw new BadRequestException('Invalid appointment status');
    }
    statusFilter = status as AppointmentStatus;
  }

  return this.appointmentsService.findAll({
    skip: skip ? parseInt(skip) : undefined,
    take: take ? parseInt(take) : undefined,
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { appointmentDate: 'asc' },
  });
}
  @Post('book')
  async bookAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto
  ): Promise<AppointmentResponseDto> {
    return this.appointmentsService.bookAppointment(createAppointmentDto);
  }

  @Get('available-slots')
  async getAvailableTimeSlots(
    @Query() query: AvailableSlotsQueryDto
  ) {
    return this.appointmentsService.getAvailableTimeSlots(query);
  }

@Put('/status/:id')
async updateAppointmentStatus(
  @Param('id') appointmentId: string,
  @Body() updateDto: UpdateAppointmentStatusDto
): Promise<AppointmentResponseDto> {
  return this.appointmentsService.updateAppointmentStatus(
    appointmentId,
    updateDto.status
  );
}


   

}