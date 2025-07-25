import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from '../../application/dtos/login.dto';
import { RegisterDto } from '../../application/dtos/register.dto';
import { RefreshTokenDto } from '../../application/dtos/refresh-token.dto';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { User } from '../../infrastructure/decorators/user.decorator';
import { PublicUserDto } from '../../application/dtos/public-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
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

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'Invalid credentials') {
        throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'Error during login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getMe(@User() user: PublicUserDto) {
    return user;
  }

  @Post('refresh')
  async refresh(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    try {
      return await this.authService.refreshToken(refreshTokenDto.refreshToken);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (
        errorMessage === 'Invalid refresh token' ||
        errorMessage === 'User not found'
      ) {
        throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'Error refreshing token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
