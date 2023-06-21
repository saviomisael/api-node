import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migration1687305275635 implements MigrationInterface {
  name = 'Migration1687305275635'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."name_games_idx"`)
    await queryRunner.query(`DROP INDEX "public"."genre_name_idx"`)
    await queryRunner.query(`DROP INDEX "public"."platform_name_idx"`)
    await queryRunner.query(`CREATE EXTENSION pg_trgm`)
    await queryRunner.query(`CREATE EXTENSION btree_gin`)
    await queryRunner.query(`CREATE INDEX games_name ON games USING GIN(name)`)
    await queryRunner.query(`CREATE INDEX platforms_name ON platforms USING GIN(name)`)
    await queryRunner.query(`CREATE INDEX genres_name ON genres USING GIN(name)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "platform_name_idx" ON "platforms" ("name") `)
    await queryRunner.query(`CREATE INDEX "genre_name_idx" ON "genres" ("name") `)
    await queryRunner.query(`CREATE INDEX "name_games_idx" ON "games" ("name") `)
    await queryRunner.query(`DROP INDEX genres_name`)
    await queryRunner.query(`DROP INDEX platforms_name`)
    await queryRunner.query(`DROP INDEX games_name`)
  }
}
