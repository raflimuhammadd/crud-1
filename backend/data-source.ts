import 'dotenv/config';
import { DataSource } from 'typeorm';
import { CreateAssetTable1710000000000 } from './src/database/migrations/1710000000000-CreateAssetTable.js';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: [CreateAssetTable1710000000000],
});
