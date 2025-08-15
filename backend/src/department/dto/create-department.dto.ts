import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
  IsJSON,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly code: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsJSON()
  readonly workingHours?: any;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
