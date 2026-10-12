import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity.js';
import { AssetService } from './services/asset.service.js';
import { AssetController } from './controllers/asset.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [AssetService],
  controllers: [AssetController],
  exports: [AssetService],
})
export class AssetModule {}
