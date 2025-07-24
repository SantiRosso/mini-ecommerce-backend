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
      select: ['id', 'email', 'name', 'password', 'createdAt', 'updatedAt'],
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
      userEntity.name,
      undefined, // No incluir password por defecto
      userEntity.createdAt,
      userEntity.updatedAt,
    );
  }

  private toDomainWithPassword(userEntity: UserEntity): User {
    return new User(
      userEntity.id,
      userEntity.email,
      userEntity.name,
      userEntity.password,
      userEntity.createdAt,
      userEntity.updatedAt,
    );
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.name = user.name;
    entity.password = user.password || '';
    entity.createdAt = user.createdAt || new Date();
    entity.updatedAt = user.updatedAt || new Date();
    return entity;
  }
}
