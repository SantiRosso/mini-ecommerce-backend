import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: any; token: string }> {
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
      registerDto.name,
      hashedPassword,
    );
    const savedUser = await this.authRepository.createUser(user);

    // Generar token
    const token = this.generateToken(savedUser);

    return {
      user: savedUser.toPublic(),
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: any; token: string }> {
    // Buscar usuario con contraseña
    const user = await this.authRepository.findUserByEmailWithPassword(
      loginDto.email,
    );
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
    const token = this.generateToken(user);

    return {
      user: user.toPublic(),
      token,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.authRepository.findUserById(userId);
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return this.jwtService.sign(payload);
  }
}
