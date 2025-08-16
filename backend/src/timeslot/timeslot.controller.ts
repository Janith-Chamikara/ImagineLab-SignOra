import { Controller, Get, Put, Query } from '@nestjs/common';
import { TimeslotService } from './timeslot.service';

@Controller('timeslot')
export class TimeslotController {
  constructor(private readonly timeslotService: TimeslotService) {}

  @Get('available')
  async getAvailableTimeSlots(
    @Query('departmentId') departmentId: string,
    @Query('date') date: string,
  ) {
    console.log(
      'Fetching available time slots for department:',
      departmentId,
      'on date:',
      date,
    );
    return await this.timeslotService.getAvailableTimeSlots(departmentId, date);
  }

  @Put('book')
  async bookTimeSlot(
    @Query('timeSlotId') timeSlotId: string,
    @Query('departmentId') departmentId: string,
    @Query('userId') userId: string,
  ) {
    return await this.timeslotService.bookTimeSlot(
      timeSlotId,
      departmentId,
      userId,
    );
  }
}
