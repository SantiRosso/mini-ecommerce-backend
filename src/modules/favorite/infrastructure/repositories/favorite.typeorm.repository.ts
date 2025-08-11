import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteRepository } from '../../domain/repositories/favorite.repository';
import { Favorite } from '../../domain/entities/favorite.entity';
import { FavoriteEntity } from '../entities/favorite.typeorm.entity';

@Injectable()
export class FavoriteTypeOrmRepository implements FavoriteRepository {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>,
  ) {}

  async addFavorite(userId: string, productId: number): Promise<Favorite> {
    const favoriteEntity = this.favoriteRepository.create({
      userId,
      productId,
    });

    const savedEntity = await this.favoriteRepository.save(favoriteEntity);
    return this.toDomain(savedEntity);
  }

  async removeFavorite(userId: string, productId: number): Promise<void> {
    await this.favoriteRepository.delete({ userId, productId });
  }

  async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    const entities = await this.favoriteRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async isFavorite(userId: string, productId: number): Promise<boolean> {
    const count = await this.favoriteRepository.count({
      where: { userId, productId },
    });

    return count > 0;
  }

  async getFavoriteCount(productId: number): Promise<number> {
    return this.favoriteRepository.count({
      where: { productId },
    });
  }

  private toDomain(entity: FavoriteEntity): Favorite {
    return new Favorite(
      entity.id,
      entity.userId,
      entity.productId,
      entity.createdAt,
    );
  }
}
