import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialDb1566469681398 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE "metadata_entity_contenttype_enum" AS ENUM('application/json')`
    )
    await queryRunner.query(
      `CREATE TYPE "metadata_entity_charset_enum" AS ENUM('utf-8')`
    )
    await queryRunner.query(
      `CREATE TYPE "metadata_entity_contentencoding_enum" AS ENUM('identity')`
    )
    await queryRunner.query(
      `CREATE TABLE "metadata_entity" ("hash" text NOT NULL, "contentType" "metadata_entity_contenttype_enum" NOT NULL, "charset" "metadata_entity_charset_enum", "contentEncoding" "metadata_entity_contentencoding_enum" NOT NULL DEFAULT 'identity', "contentLength" integer NOT NULL, "url" text NOT NULL, CONSTRAINT "PK_afd9269e74ad7d0d0fb2d07c723" PRIMARY KEY ("hash"))`
    )
    await queryRunner.query(
      `CREATE TABLE "data_entity" ("binaryData" bytea NOT NULL, "metaDataHash" text NOT NULL, CONSTRAINT "REL_8a6b4ff7646e65733c0f73a12d" UNIQUE ("metaDataHash"), CONSTRAINT "PK_8a6b4ff7646e65733c0f73a12dc" PRIMARY KEY ("metaDataHash"))`
    )
    await queryRunner.query(
      `CREATE TYPE "transaction_data_entity_rendertype_enum" AS ENUM('00', '01')`
    )
    await queryRunner.query(
      `CREATE TABLE "transaction_data_entity" ("transactionHash" text NOT NULL, "renderType" "transaction_data_entity_rendertype_enum", "metaDataHash" text, CONSTRAINT "PK_08fa2ce40fada79cdbd641c27dc" PRIMARY KEY ("transactionHash"))`
    )
    await queryRunner.query(
      `ALTER TABLE "data_entity" ADD CONSTRAINT "FK_8a6b4ff7646e65733c0f73a12dc" FOREIGN KEY ("metaDataHash") REFERENCES "metadata_entity"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "transaction_data_entity" ADD CONSTRAINT "FK_9a998b231898717e8cfc0a91326" FOREIGN KEY ("metaDataHash") REFERENCES "metadata_entity"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "transaction_data_entity" DROP CONSTRAINT "FK_9a998b231898717e8cfc0a91326"`
    )
    await queryRunner.query(
      `ALTER TABLE "data_entity" DROP CONSTRAINT "FK_8a6b4ff7646e65733c0f73a12dc"`
    )
    await queryRunner.query(`DROP TABLE "transaction_data_entity"`)
    await queryRunner.query(
      `DROP TYPE "transaction_data_entity_rendertype_enum"`
    )
    await queryRunner.query(`DROP TABLE "data_entity"`)
    await queryRunner.query(`DROP TABLE "metadata_entity"`)
    await queryRunner.query(`DROP TYPE "metadata_entity_contentencoding_enum"`)
    await queryRunner.query(`DROP TYPE "metadata_entity_charset_enum"`)
    await queryRunner.query(`DROP TYPE "metadata_entity_contenttype_enum"`)
  }
}
