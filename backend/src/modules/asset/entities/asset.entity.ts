import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AssetCategory {
  CONSUMABLE = 'Consumable',
  NON_CONSUMABLE = 'Non-Consumable',
}

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  asset_id: number;

  @Column({ type: 'varchar', length: 255 })
  asset_name: string;

  @Column({ type: 'integer' })
  stock_quantity: number;

  @Column({
    type: 'enum',
    enum: AssetCategory,
  })
  category: AssetCategory;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
