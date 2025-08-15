import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateServiceDto } from './dto/create-service.dto';

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
    return await this.prismaService.department.create({
      data: {
        ...departmentData,
        workingHours: departmentData.workingHours
          ? JSON.parse(departmentData.workingHours)
          : null,
      },
    });
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
