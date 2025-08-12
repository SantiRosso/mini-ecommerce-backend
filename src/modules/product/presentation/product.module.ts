import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../infrastructure/entities/product.typeorm.entity';
import { ProductTypeOrmRepository } from '../infrastructure/repositories/product.typeorm.repository';
import { ProductService } from '../application/services/product.service';
import { ProductController } from './product.controller';
import { PRODUCT_REPOSITORY_TOKEN } from '../domain/repositories/product.repository.token';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: ProductTypeOrmRepository,
    },
  ],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
