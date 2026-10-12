import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssetTable1710000000000 implements MigrationInterface {
  name = 'CreateAssetTable1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."asset_category_enum" AS ENUM('Consumable', 'Non-Consumable')`);
    await queryRunner.query(`CREATE TABLE "asset" ("asset_id" SERIAL NOT NULL, "asset_name" character varying(255) NOT NULL, "stock_quantity" integer NOT NULL, "category" "public"."asset_category_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_asset_id" PRIMARY KEY ("asset_id"), CONSTRAINT "CHK_asset_stock_quantity" CHECK ("stock_quantity" >= 0))`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "asset"`);
    await queryRunner.query(`DROP TYPE "public"."asset_category_enum"`);
  }
}
