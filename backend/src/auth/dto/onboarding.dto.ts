import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class OnboardingDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly nationalId: string;

  @IsString()
  @IsNotEmpty()
  readonly dateOfBirth: Date;

  @IsString()
  @IsOptional()
  readonly address: string;

  @IsString()
  @IsOptional()
  readonly city: string;

  @IsString()
  @IsOptional()
  readonly province: string;

  @IsString()
  @IsNotEmpty()
  readonly gnDivision: string;

  @IsString()
  @IsNotEmpty()
  readonly divisionalSecretariat: string;

  @IsString()
  @IsOptional()
  readonly postalCode: string;
}
