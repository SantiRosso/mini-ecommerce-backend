import { FavoriteEntity } from 'src/modules/favorite/infrastructure/entities/favorite.typeorm.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.product, {
    cascade: true, // Cuando se elimina el producto, se eliminan los favoritos
  })
  favorites?: FavoriteEntity[];
}
