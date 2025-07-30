import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductEntity } from '../entities/product.typeorm.entity';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.repo.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: number): Promise<Product | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(product: Product): Promise<Product> {
    const entity = this.toEntity(product);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(product: Product): Promise<Product> {
    const entity = this.toEntity(product);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(entity: ProductEntity): Product {
    return new Product(entity.id, entity.name, Number(entity.price));
  }

  private toEntity(product: Product): ProductEntity {
    const entity = new ProductEntity();
    entity.id = product.id;
    entity.name = product.name;
    entity.price = product.price;
    return entity;
  }
}
