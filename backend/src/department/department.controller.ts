import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get('get-info-single')
  async getDepartmentInfoHandler(@Query('id') departmentId: string) {
    return await this.departmentService.getDepartmentById(departmentId);
  }

  @Get('get-all')
  async getAllDepartmentsHandler() {
    return await this.departmentService.getAllDepartments();
  }

  @Post('create')
  async createDepartmentHandler(@Body() departmentData: CreateDepartmentDto) {
    return await this.departmentService.createDepartment(departmentData);
  }

  @Get('services')
  async getServicesByDepartmentIdHandler(@Query('id') departmentId: string) {
    return await this.departmentService.getServicesByDepartmentId(departmentId);
  }

  @Post('create-service')
  async createServiceHandler(@Body() createServiceDto: CreateServiceDto) {
    return await this.departmentService.createService(createServiceDto);
  }
}
