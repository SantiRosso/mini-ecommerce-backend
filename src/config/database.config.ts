import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../modules/user/infrastructure/entities/user.typeorm.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mini_ecommerce',
  entities: [UserEntity],
  synchronize: process.env.NODE_ENV !== 'production', // Solo en desarrollo
  logging: process.env.NODE_ENV === 'development',
  timezone: 'Z',
  charset: 'utf8mb4',
};
