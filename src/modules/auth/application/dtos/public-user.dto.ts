import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PublicUserDto {
  @IsNotEmpty()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
