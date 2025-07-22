import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './application/services/user.service';
import { USER_REPOSITORY_TOKEN } from './domain/repositories/user.repository.token';
import { UserEntity } from './infrastructure/entities/user.typeorm.entity';
import { UserTypeOrmRepository } from './infrastructure/repositories/user.typeorm.repository';
import { UserController } from './presentation/controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
