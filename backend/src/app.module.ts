import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AssetModule } from './modules/asset/asset.module.js';
import { Asset } from './modules/asset/entities/asset.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'fumindo_test'),
        password: configService.get('DB_PASSWORD', 'fumindo_123'),
        database: configService.get('DB_NAME', 'asset_fumindo'),
        entities: [Asset],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: false,
      }),
    }),
    AssetModule,
  ],
})
export class AppModule {}
