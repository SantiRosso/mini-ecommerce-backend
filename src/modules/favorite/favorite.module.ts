import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from './infrastructure/entities/favorite.typeorm.entity';
import { FavoriteTypeOrmRepository } from './infrastructure/repositories/favorite.typeorm.repository';
import { FavoriteService } from './application/services/favorite.service';
import { FavoriteController } from './presentation/controllers/favorite.controller';
import { FAVORITE_REPOSITORY_TOKEN } from './domain/repositories/favorite.repository.token';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity])],
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
    {
      provide: FAVORITE_REPOSITORY_TOKEN,
      useClass: FavoriteTypeOrmRepository,
    },
  ],
  exports: [FavoriteService],
})
export class FavoriteModule {}
