import { IsString, IsUUID, IsOptional, IsEnum, IsDate } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  serviceId: string;

  @IsUUID()
  timeSlotId: string;

  @IsOptional()
  @IsUUID()
  officerId?: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  appointmentDate: string;

  @IsOptional()
  @IsDate()
  completedAt?: Date;
}
