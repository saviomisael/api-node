import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migration1687304742940 implements MigrationInterface {
  name = 'Migration1687304742940'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_c01e7e1e559de1afdfa0dd79e4f"`)
    await queryRunner.query(
      `CREATE TABLE "age_ratings" ("id" character varying(36) NOT NULL, "age" character varying(3) NOT NULL, "description" character varying(256) NOT NULL, CONSTRAINT "UQ_a399d5fdf3c712ba01a27ef4a28" UNIQUE ("age"), CONSTRAINT "PK_202b67bffc1702473d2c9851684" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_c01e7e1e559de1afdfa0dd79e4f" FOREIGN KEY ("ageRatingId") REFERENCES "age_ratings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_c01e7e1e559de1afdfa0dd79e4f"`)
    await queryRunner.query(`DROP TABLE "age_ratings"`)
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_c01e7e1e559de1afdfa0dd79e4f" FOREIGN KEY ("ageRatingId") REFERENCES "ageRatings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
