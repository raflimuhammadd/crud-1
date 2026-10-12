import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode } from '@nestjs/common';
import { AssetService } from '../services/asset.service.js';
import { CreateAssetDto } from '../dtos/create-asset.dto.js';
import { UpdateAssetDto } from '../dtos/update-asset.dto.js';
import { Asset } from '../entities/asset.entity.js';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto): Promise<Asset> {
    return await this.assetService.create(createAssetDto);
  }

  @Get()
  async findAll(): Promise<Asset[]> {
    return await this.assetService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Asset | null> {
    return await this.assetService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto): Promise<Asset | null> {
    return await this.assetService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.assetService.delete(+id);
  }
}
