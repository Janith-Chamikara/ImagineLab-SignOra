import { IsDefined, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
export class SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
