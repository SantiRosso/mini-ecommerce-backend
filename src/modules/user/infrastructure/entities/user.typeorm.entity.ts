import { FavoriteEntity } from 'src/modules/favorite/infrastructure/entities/favorite.typeorm.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false }) // No incluir password por defecto en las consultas
  password: string;

  @Column({ nullable: true, select: false })
  refreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.user, {
    cascade: true, // Cuando se elimina el usuario, se eliminan sus favoritos
  })
  favorites?: FavoriteEntity[];
}
