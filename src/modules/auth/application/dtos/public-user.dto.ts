import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PublicUserDto {
  @IsNotEmpty()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
