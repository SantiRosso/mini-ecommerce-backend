import { ProductEntity } from 'src/modules/product/infrastructure/entities/product.typeorm.entity';
import { UserEntity } from 'src/modules/user/infrastructure/entities/user.typeorm.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('favorites')
@Unique(['userId', 'productId']) // Un usuario no puede tener el mismo producto como favorito más de una vez
@Index(['userId']) // Índice para búsquedas por usuario
@Index(['productId']) // Índice para búsquedas por producto
export class FavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('int')
  productId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
