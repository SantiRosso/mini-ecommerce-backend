import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../infrastructure/entities/product.typeorm.entity';
import { ProductTypeOrmRepository } from '../infrastructure/repositories/product.typeorm.repository';
import { ProductService } from '../application/services/product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [
    ProductService,
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
  ],
  controllers: [ProductController],
})
export class ProductModule {}
