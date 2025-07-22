import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserService } from '../../application/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch {
      throw new HttpException(
        'Error retrieving users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error retrieving user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'User with this email already exists') {
        throw new HttpException(errorMessage, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'User not found') {
        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
      }
      if (errorMessage === 'User with this email already exists') {
        throw new HttpException(errorMessage, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Error updating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.userService.delete(id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'User not found') {
        throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error deleting user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
