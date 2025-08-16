import { Module } from '@nestjs/common';
import { TimeslotController } from './timeslot.controller';
import { TimeslotService } from './timeslot.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TimeslotController],
  providers: [TimeslotService, PrismaService],
})
export class TimeslotModule {}
