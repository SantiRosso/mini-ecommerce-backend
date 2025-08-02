import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../entities/user.typeorm.entity';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const userEntities = await this.userRepository.find();
    return userEntities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { email } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async create(user: User): Promise<User> {
    const userEntity = this.toEntity(user);
    const savedEntity = await this.userRepository.save(userEntity);
    return this.toDomain(savedEntity);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    const updatedEntity = await this.userRepository.findOne({ where: { id } });
    if (!updatedEntity) {
      throw new Error('User not found after update');
    }
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
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
    );
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.firstName = user.firstName;
    entity.lastName = user.lastName;
    entity.password = user.password || '';
    entity.createdAt = user.createdAt || new Date();
    entity.updatedAt = user.updatedAt || new Date();
    return entity;
  }
}
