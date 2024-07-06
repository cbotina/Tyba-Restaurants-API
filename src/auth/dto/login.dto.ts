import { IsString, IsNotEmpty, MaxLength, IsEmail } from 'class-validator';

export class LoginDto {
  @MaxLength(320)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  password: string;
}
