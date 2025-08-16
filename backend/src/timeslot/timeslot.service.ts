import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TimeslotService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAvailableTimeSlots(departmentId: string, date: string) {
    if (!departmentId || !date) {
      throw new NotFoundException('Department ID and date are required');
    }

    return await this.prismaService.timeSlot.findMany({
      where: {
        departmentId: departmentId,
        date: date,
        status: 'AVAILABLE',
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async bookTimeSlot(timeSlotId: string, departmentId: string, userId: string) {
    if (!timeSlotId || !departmentId || !userId) {
      throw new NotFoundException(
        'Time slot ID, department ID, and user ID are required',
      );
    }

    const timeSlot = await this.prismaService.timeSlot.findUnique({
      where: { id: timeSlotId },
    });

    if (!timeSlot || timeSlot.status !== 'AVAILABLE') {
      throw new NotFoundException('Time slot not found or not available');
    }

    // Update the time slot to booked status
    return await this.prismaService.timeSlot.update({
      where: { id: timeSlotId },
      data: {
        status: 'FULL',
        currentBookings: timeSlot.currentBookings + 1,
      },
    });
  }
}
