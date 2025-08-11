import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/user/infrastructure/entities/user.typeorm.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { FavoriteEntity } from './modules/favorite/infrastructure/entities/favorite.typeorm.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '3306')),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'mini_ecommerce'),
        entities: [UserEntity, FavoriteEntity],
        synchronize: configService.get('NODE_ENV') !== 'production',
        // logging: configService.get('NODE_ENV') === 'development',
        logging: false,
        timezone: 'Z',
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    FavoriteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
