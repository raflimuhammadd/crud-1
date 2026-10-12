import { IsString, IsInt, IsEnum, Min, Max } from 'class-validator';
import { AssetCategory } from '../entities/asset.entity.js';

export class CreateAssetDto {
  @IsString()
  asset_name: string;

  @IsInt()
  @Min(0)
  stock_quantity: number;

  @IsEnum(AssetCategory)
  category: AssetCategory;
}
