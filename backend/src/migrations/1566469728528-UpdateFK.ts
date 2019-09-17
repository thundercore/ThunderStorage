import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateFK1566469728528 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "data_entity" DROP CONSTRAINT "FK_8a6b4ff7646e65733c0f73a12dc"`
    )
    await queryRunner.query(
      `ALTER TABLE "data_entity" ADD CONSTRAINT "UQ_8a6b4ff7646e65733c0f73a12dc" UNIQUE ("metaDataHash")`
    )
    await queryRunner.query(
      `ALTER TABLE "data_entity" ADD CONSTRAINT "FK_8a6b4ff7646e65733c0f73a12dc" FOREIGN KEY ("metaDataHash") REFERENCES "metadata_entity"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "data_entity" DROP CONSTRAINT "FK_8a6b4ff7646e65733c0f73a12dc"`
    )
    await queryRunner.query(
      `ALTER TABLE "data_entity" DROP CONSTRAINT "UQ_8a6b4ff7646e65733c0f73a12dc"`
    )
    await queryRunner.query(
      `ALTER TABLE "data_entity" ADD CONSTRAINT "FK_8a6b4ff7646e65733c0f73a12dc" FOREIGN KEY ("metaDataHash") REFERENCES "metadata_entity"("hash") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
