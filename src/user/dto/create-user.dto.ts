import { IsEmail, IsNotEmpty, MinLength, IsString, IsEnum } from 'class-validator';
import { Role } from "@prisma/client"
import { Transform } from 'class-transformer';


export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string; // ✅ must match Prisma model

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(Role)
  @Transform(({ value }) => value?.toUpperCase())
  role?: Role;
}
