import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  findById(id: number): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  create(dto: CreateProductDto): Promise<Product> {
    const product = new Product(0, dto.name, dto.price);
    return this.productRepository.create(product);
  }

  update(id: number, dto: UpdateProductDto): Promise<Product> {
    return this.productRepository.findById(id).then((product) => {
      if (!product) throw new Error('Product not found');
      const updated = new Product(
        product.id,
        dto.name ?? product.name,
        dto.price ?? product.price,
      );
      return this.productRepository.update(updated);
    });
  }

  delete(id: number): Promise<void> {
    return this.productRepository.delete(id);
  }
}
