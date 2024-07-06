import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsStrongPasswordOptions,
  IsStrongPassword,
  IsNumber,
  IsOptional,
} from 'class-validator';

const passwordOptions: IsStrongPasswordOptions = {
  minLength: 8,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export class RegisterDto {
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @MaxLength(30)
  @IsStrongPassword(passwordOptions)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(64)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsOptional()
  balance?: number;
}
