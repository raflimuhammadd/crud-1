import { IsString, IsInt, IsEnum, Min, IsOptional } from 'class-validator';
import { AssetCategory } from '../entities/asset.entity.js';

export class UpdateAssetDto {
  @IsOptional()
  @IsString()
  asset_name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock_quantity?: number;

  @IsOptional()
  @IsEnum(AssetCategory)
  category?: AssetCategory;
}
