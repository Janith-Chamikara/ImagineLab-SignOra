import { User } from '@prisma/client';
import { Service } from '@prisma/client';
import { TimeSlot } from '@prisma/client';
import { Officer } from '@prisma/client';

export class AppointmentResponseDto {
  id: string;
  bookingReference: string;
  qrCode: string;
  status: string;
  appointmentDate: Date;
  user: User;
  service: Service;
  timeSlot: TimeSlot;
  officer: Officer;
}