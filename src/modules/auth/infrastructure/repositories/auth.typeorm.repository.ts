import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../user/domain/entities/user.entity';
import { UserEntity } from '../../../user/infrastructure/entities/user.typeorm.entity';
import { AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable()
export class AuthTypeOrmRepository implements AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { email } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'password',
        'createdAt',
        'updatedAt',
      ],
    });
    return userEntity ? this.toDomainWithPassword(userEntity) : null;
  }

  async createUser(user: User): Promise<User> {
    const userEntity = this.toEntity(user);
    const savedEntity = await this.userRepository.save(userEntity);
    return this.toDomain(savedEntity);
  }

  private toDomain(userEntity: UserEntity): User {
    return new User(
      userEntity.id,
      userEntity.email,
      userEntity.firstName,
      userEntity.lastName,
      undefined, // No incluir password por defecto
      userEntity.createdAt,
      userEntity.updatedAt,
      userEntity.refreshToken,
    );
  }

  private toDomainWithPassword(userEntity: UserEntity): User {
    return new User(
      userEntity.id,
      userEntity.email,
      userEntity.firstName,
      userEntity.lastName,
      undefined, // No incluir password por defecto
      userEntity.createdAt,
      userEntity.updatedAt,
      userEntity.refreshToken,
    );
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    if (!user.password) {
      throw new Error('Password is required when creating a user entity');
    }
    entity.password = user.password;
    entity.refreshToken = user.refreshToken;
    entity.createdAt = user.createdAt || new Date();
    entity.updatedAt = user.updatedAt || new Date();
    return entity;
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  async isRefreshTokenValid(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const userEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'refreshToken'],
    });

    return userEntity?.refreshToken === refreshToken;
  }
}
