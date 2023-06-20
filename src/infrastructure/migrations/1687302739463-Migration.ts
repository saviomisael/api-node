import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migration1687302739463 implements MigrationInterface {
  name = 'Migration1687302739463'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "games" ("id" character varying(36) NOT NULL, "name" character varying(255) NOT NULL, "price" numeric(10,2) NOT NULL, "description" text NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "ageRatingId" character varying(36), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE INDEX "name_games_idx" ON "games" ("name") `)
    await queryRunner.query(
      `CREATE TABLE "ageRatings" ("id" character varying(36) NOT NULL, "age" character varying(3) NOT NULL, "description" character varying(256) NOT NULL, CONSTRAINT "UQ_9cb868c2e2862862eafa4fe7486" UNIQUE ("age"), CONSTRAINT "PK_1a246c43978a44ea630780a08ff" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "genres" ("id" character varying(36) NOT NULL, "name" character varying(256) NOT NULL, CONSTRAINT "UQ_f105f8230a83b86a346427de94d" UNIQUE ("name"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE INDEX "genre_name_idx" ON "genres" ("name") `)
    await queryRunner.query(
      `CREATE TABLE "platforms" ("id" character varying(36) NOT NULL, "name" character varying(256) NOT NULL, CONSTRAINT "UQ_6add27e349b6905c85e016fa2c4" UNIQUE ("name"), CONSTRAINT "PK_3b879853678f7368d46e52b81c6" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE INDEX "platform_name_idx" ON "platforms" ("name") `)
    await queryRunner.query(
      `CREATE TABLE "reviewers" ("id" character varying(36) NOT NULL, "temporaryPassword" character varying(60) NOT NULL DEFAULT '', "tempPasswordTime" TIMESTAMP, "createdAtUtcTime" TIMESTAMP NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(60) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "PK_79de995aea9d2f606dff4cfefcd" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" character varying NOT NULL, "description" text NOT NULL, "stars" smallint NOT NULL, "gameId" character varying(36), "reviewerId" character varying(36), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "games_platforms_platforms" ("gamesId" character varying(36) NOT NULL, "platformsId" character varying(36) NOT NULL, CONSTRAINT "PK_7daf4bc78e1235feed427c85bd6" PRIMARY KEY ("gamesId", "platformsId"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_4b21c6613c6f02c52206dababb" ON "games_platforms_platforms" ("gamesId") `)
    await queryRunner.query(
      `CREATE INDEX "IDX_ff408be3cb15c2c316365ff574" ON "games_platforms_platforms" ("platformsId") `
    )
    await queryRunner.query(
      `CREATE TABLE "games_genres_genres" ("gamesId" character varying(36) NOT NULL, "genresId" character varying(36) NOT NULL, CONSTRAINT "PK_688976916276a7700eda129b9c0" PRIMARY KEY ("gamesId", "genresId"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_d3ac65ea9002de25d3d841d2b6" ON "games_genres_genres" ("gamesId") `)
    await queryRunner.query(`CREATE INDEX "IDX_5d59ed8cbec8cc23ca2c251545" ON "games_genres_genres" ("genresId") `)
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_c01e7e1e559de1afdfa0dd79e4f" FOREIGN KEY ("ageRatingId") REFERENCES "ageRatings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_b1fad171e95a3e00bd06bbbbf79" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_f9238c3e3739dc40322f577fc46" FOREIGN KEY ("reviewerId") REFERENCES "reviewers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "games_platforms_platforms" ADD CONSTRAINT "FK_4b21c6613c6f02c52206dababb4" FOREIGN KEY ("gamesId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "games_platforms_platforms" ADD CONSTRAINT "FK_ff408be3cb15c2c316365ff574e" FOREIGN KEY ("platformsId") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "games_genres_genres" ADD CONSTRAINT "FK_d3ac65ea9002de25d3d841d2b62" FOREIGN KEY ("gamesId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "games_genres_genres" ADD CONSTRAINT "FK_5d59ed8cbec8cc23ca2c2515455" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "games_genres_genres" DROP CONSTRAINT "FK_5d59ed8cbec8cc23ca2c2515455"`)
    await queryRunner.query(`ALTER TABLE "games_genres_genres" DROP CONSTRAINT "FK_d3ac65ea9002de25d3d841d2b62"`)
    await queryRunner.query(`ALTER TABLE "games_platforms_platforms" DROP CONSTRAINT "FK_ff408be3cb15c2c316365ff574e"`)
    await queryRunner.query(`ALTER TABLE "games_platforms_platforms" DROP CONSTRAINT "FK_4b21c6613c6f02c52206dababb4"`)
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_f9238c3e3739dc40322f577fc46"`)
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_b1fad171e95a3e00bd06bbbbf79"`)
    await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_c01e7e1e559de1afdfa0dd79e4f"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_5d59ed8cbec8cc23ca2c251545"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_d3ac65ea9002de25d3d841d2b6"`)
    await queryRunner.query(`DROP TABLE "games_genres_genres"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_ff408be3cb15c2c316365ff574"`)
    await queryRunner.query(`DROP INDEX "public"."IDX_4b21c6613c6f02c52206dababb"`)
    await queryRunner.query(`DROP TABLE "games_platforms_platforms"`)
    await queryRunner.query(`DROP TABLE "reviews"`)
    await queryRunner.query(`DROP TABLE "reviewers"`)
    await queryRunner.query(`DROP INDEX "public"."platform_name_idx"`)
    await queryRunner.query(`DROP TABLE "platforms"`)
    await queryRunner.query(`DROP INDEX "public"."genre_name_idx"`)
    await queryRunner.query(`DROP TABLE "genres"`)
    await queryRunner.query(`DROP TABLE "ageRatings"`)
    await queryRunner.query(`DROP INDEX "public"."name_games_idx"`)
    await queryRunner.query(`DROP TABLE "games"`)
  }
}
