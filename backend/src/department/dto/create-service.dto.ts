import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  IsUUID,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly code?: string;

  @IsString()
  readonly description: string;

  @IsUUID()
  @IsNotEmpty()
  readonly departmentId: string;

  @IsInt()
  readonly estimatedTime: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly requiredDocuments?: string[];

  @IsNumber()
  readonly fee: number;

  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;

  @IsOptional()
  readonly createdAt?: Date;

  @IsOptional()
  readonly updatedAt?: Date;
}

export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly code?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsUUID()
  @IsOptional()
  readonly departmentId?: string;

  @IsInt()
  @IsOptional()
  readonly estimatedTime?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly requiredDocuments?: string[];

  @IsNumber()
  @IsOptional()
  readonly fee?: number;

  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;

  @IsOptional()
  readonly updatedAt?: Date;
}
