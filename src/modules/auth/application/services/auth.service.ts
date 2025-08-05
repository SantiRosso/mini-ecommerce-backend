import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../../user/domain/entities/user.entity';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AUTH_REPOSITORY_TOKEN } from '../../domain/repositories/auth.repository.token';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: any; accesshToken: string; refreshToken: string }> {
    // Verificar si el usuario ya existe
    const existingUser = await this.authRepository.findUserByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Crear usuario
    const user = User.create(
      registerDto.email,
      registerDto.firstName,
      registerDto.lastName,
      hashedPassword,
    );
    const savedUser = await this.authRepository.createUser(user);

    // Generar token
    const accesshToken = this.generateAccessToken(savedUser);
    const refreshToken = this.generateRefreshToken(savedUser);

    await this.authRepository.saveRefreshToken(savedUser.id, refreshToken);

    return {
      user: savedUser.toPublic(),
      accesshToken,
      refreshToken,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    // Buscar usuario con contraseña
    const user = await this.authRepository.findUserByEmail(loginDto.email);
    console.log('Hola', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password || '',
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar token
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: user.toPublic(),
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.authRepository.findUserById(userId);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // interface JwtPayload {
      //   sub: string;
      //   iat?: number;
      //   exp?: number;
      // }

      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const user = await this.authRepository.findUserById(payload.sub);

      if (
        !user ||
        !(await this.authRepository.isRefreshTokenValid(user.id, refreshToken))
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.generateAccessToken(user);

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') },
    );
  }

  private generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id },
      {
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      },
    );
  }
}
