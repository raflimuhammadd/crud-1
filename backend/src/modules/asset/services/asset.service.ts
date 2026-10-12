import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../entities/asset.entity.js';
import { CreateAssetDto } from '../dtos/create-asset.dto.js';
import { UpdateAssetDto } from '../dtos/update-asset.dto.js';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetRepository.create(createAssetDto);
    return await this.assetRepository.save(asset);
  }

  async findAll(): Promise<Asset[]> {
    return await this.assetRepository.find();
  }

  async findOne(id: number): Promise<Asset | null> {
    return await this.assetRepository.findOne({ where: { asset_id: id } });
  }

  async update(id: number, updateAssetDto: UpdateAssetDto): Promise<Asset | null> {
    await this.assetRepository.update(id, updateAssetDto);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const asset = await this.findOne(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    await this.assetRepository.delete(id);
  }
}
