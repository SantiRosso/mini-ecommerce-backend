import { Favorite } from '../entities/favorite.entity';

export abstract class FavoriteRepository {
  abstract addFavorite(userId: string, productId: number): Promise<Favorite>;
  abstract removeFavorite(userId: string, productId: number): Promise<void>;
  abstract getFavoritesByUser(userId: string): Promise<Favorite[]>;
  abstract isFavorite(userId: string, productId: number): Promise<boolean>;
  abstract getFavoriteCount(productId: number): Promise<number>;
}
