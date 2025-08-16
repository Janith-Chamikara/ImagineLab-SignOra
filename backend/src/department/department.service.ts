import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { TimeSlotStatus } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDepartmentById(departmentId: string) {
    if (!departmentId) {
      throw new NotFoundException('Department ID is required');
    }
    return await this.prismaService.department.findUnique({
      where: { id: departmentId },
      include: {
        services: true,
      },
    });
  }

  async getAllDepartments() {
    return await this.prismaService.department.findMany();
  }

  async createDepartment(departmentData: CreateDepartmentDto) {
    const existingDepartment = await this.prismaService.department.findUnique({
      where: { name: departmentData.name },
    });

    if (existingDepartment) {
      throw new ConflictException('Department name already exists');
    }

    // Parse working hours from departmentData
    const workingHours = departmentData.workingHours
      ? JSON.parse(departmentData.workingHours)
      : null;

    // Create the department
    const department = await this.prismaService.department.create({
      data: {
        ...departmentData,
        workingHours: workingHours,
      },
    });

    // Now, create time slots based on working hours
    if (workingHours) {
      for (const day in workingHours) {
        const daySchedule = workingHours[day];
        if (daySchedule.isOpen) {
          // Convert open and close times to string format (e.g., "08:00")
          const openTime = daySchedule.openTime;
          const closeTime = daySchedule.closeTime;

          // Generate time slots for the department between open and close times
          let currentStartTime = openTime;
          while (
            this.timeToMinutes(currentStartTime) < this.timeToMinutes(closeTime)
          ) {
            // Calculate the next time slot (1-hour duration)
            const currentEndTime = this.addOneHour(currentStartTime);

            // Format the time slot as a string (e.g., "08:00 - 09:00")
            const timeSlotString = `${currentStartTime} - ${currentEndTime}`;

            // Create the time slot for the day
            await this.prismaService.timeSlot.create({
              data: {
                departmentId: department.id,
                date: day, // Store the day name (e.g., "monday")
                startTime: timeSlotString.split(' - ')[0], // Store start time as a string
                endTime: timeSlotString.split(' - ')[1], // Store end time as a string
                maxBookings: 1, // Adjust as needed
                currentBookings: 0,
                status: TimeSlotStatus.AVAILABLE,
              },
            });

            // Move to the next hour
            currentStartTime = currentEndTime;
          }
        }
      }
    }

    return department;
  }

  // Helper function to convert time string to minutes for comparison
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map((str) => parseInt(str, 10));
    return hours * 60 + minutes;
  }

  // Helper function to add one hour to a time string
  private addOneHour(time: string): string {
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(':').map((str) => parseInt(str, 10));
    hours += 1; // Add one hour
    if (hours === 24) hours = 0; // Handle 24-hour rollover if needed
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  async updateDepartment(
    departmentId: string,
    departmentData: CreateDepartmentDto,
  ) {
    const existingDepartment = await this.prismaService.department.findUnique({
      where: { id: departmentId },
    });
    if (!existingDepartment) {
      throw new NotFoundException('Department not found');
    }
    return await this.prismaService.department.update({
      where: { id: departmentId },
      data: departmentData,
    });
  }

  async deleteDepartment(departmentId: string) {
    const existingDepartment = await this.prismaService.department.findUnique({
      where: { id: departmentId },
    });
    if (!existingDepartment) {
      throw new NotFoundException('Department not found');
    }
    return await this.prismaService.department.delete({
      where: { id: departmentId },
    });
  }

  async getServicesByDepartmentId(departmentId: string) {
    const department = await this.prismaService.department.findUnique({
      where: { id: departmentId },
      include: { services: true },
    });
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return department.services;
  }

  async createService(createServiceDto: CreateServiceDto) {
    const department = await this.prismaService.department.findUnique({
      where: { id: createServiceDto.departmentId },
    });
    if (!department) {
      throw new NotFoundException('Department not found');
    }
    return await this.prismaService.service.create({
      data: {
        code: createServiceDto.code,
        name: createServiceDto.name,
        description: createServiceDto.description,
        departmentId: createServiceDto.departmentId,
        estimatedTime: createServiceDto.estimatedTime,
        requiredDocuments: createServiceDto?.requiredDocuments,
        fee: createServiceDto.fee,
        isActive: createServiceDto.isActive,
      },
    });
  }
}
