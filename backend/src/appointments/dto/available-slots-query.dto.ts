import { IsString, IsOptional, IsISO8601 } from 'class-validator';

export class AvailableSlotsQueryDto {
  @IsString()
  serviceId: string;

  @IsOptional()
  @IsISO8601() // Ensures valid date strings
  startDate?: string;

  @IsOptional()
  @IsISO8601()
  endDate?: string;
}