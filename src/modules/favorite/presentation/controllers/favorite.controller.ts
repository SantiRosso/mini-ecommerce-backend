import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FavoriteService } from '../../application/services/favorite.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { User } from '../../../auth/infrastructure/decorators/user.decorator';
import { PublicUserDto } from '../../../auth/application/dtos/public-user.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post(':productId')
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(
    @User() user: PublicUserDto,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const result = await this.favoriteService.addFavorite(user.id, productId);
    return {
      message: 'Product added to favorites successfully',
      favorite: result,
    };
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(
    @User() user: PublicUserDto,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    await this.favoriteService.removeFavorite(user.id, productId);
  }

  @Get()
  async getFavorites(@User() user: PublicUserDto) {
    const favorites = await this.favoriteService.getFavoritesByUser(user.id);
    return {
      favorites,
      count: favorites.length,
    };
  }

  @Get(':productId/check')
  async isFavorite(
    @User() user: PublicUserDto,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const isFavorite = await this.favoriteService.isFavorite(
      user.id,
      productId,
    );
    return {
      isFavorite,
      productId,
    };
  }

  @Get(':productId/count')
  async getFavoriteCount(@Param('productId', ParseIntPipe) productId: number) {
    const count = await this.favoriteService.getFavoriteCount(productId);
    return {
      productId,
      favoriteCount: count,
    };
  }

  @Post(':productId/toggle')
  async toggleFavorite(
    @User() user: PublicUserDto,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const result = await this.favoriteService.toggleFavorite(
      user.id,
      productId,
    );
    return {
      message: result.isFavorite
        ? 'Product added to favorites'
        : 'Product removed from favorites',
      isFavorite: result.isFavorite,
      favorite: result.favorite,
    };
  }
}
