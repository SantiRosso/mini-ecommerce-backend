import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { FavoriteRepository } from '../../domain/repositories/favorite.repository';
import { FAVORITE_REPOSITORY_TOKEN } from '../../domain/repositories/favorite.repository.token';
import { Favorite } from '../../domain/entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @Inject(FAVORITE_REPOSITORY_TOKEN)
    private readonly favoriteRepository: FavoriteRepository,
  ) {}

  async addFavorite(userId: string, productId: number): Promise<Favorite> {
    // Verificar si ya existe el favorito
    const isAlreadyFavorite = await this.favoriteRepository.isFavorite(
      userId,
      productId,
    );
    if (isAlreadyFavorite) {
      throw new ConflictException('Product is already in favorites');
    }

    return this.favoriteRepository.addFavorite(userId, productId);
  }

  async removeFavorite(userId: string, productId: number): Promise<void> {
    // Verificar si el favorito existe
    const isFavorite = await this.favoriteRepository.isFavorite(
      userId,
      productId,
    );
    if (!isFavorite) {
      throw new NotFoundException('Favorite not found');
    }

    return this.favoriteRepository.removeFavorite(userId, productId);
  }

  async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    return this.favoriteRepository.getFavoritesByUser(userId);
  }

  async isFavorite(userId: string, productId: number): Promise<boolean> {
    return this.favoriteRepository.isFavorite(userId, productId);
  }

  async getFavoriteCount(productId: number): Promise<number> {
    return this.favoriteRepository.getFavoriteCount(productId);
  }

  async toggleFavorite(
    userId: string,
    productId: number,
  ): Promise<{ isFavorite: boolean; favorite?: Favorite }> {
    const isCurrentlyFavorite = await this.favoriteRepository.isFavorite(
      userId,
      productId,
    );

    if (isCurrentlyFavorite) {
      await this.favoriteRepository.removeFavorite(userId, productId);
      return { isFavorite: false };
    } else {
      const favorite = await this.favoriteRepository.addFavorite(
        userId,
        productId,
      );
      return { isFavorite: true, favorite };
    }
  }
}
