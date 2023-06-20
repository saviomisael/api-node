import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migration1687220604661 implements MigrationInterface {
  name = 'Migration1687220604661'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`games\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`description\` text NOT NULL, \`releaseDate\` datetime NOT NULL, \`ageRatingId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`ageRatings\` (\`id\` varchar(36) NOT NULL, \`age\` varchar(3) NOT NULL, \`description\` varchar(256) NOT NULL, UNIQUE INDEX \`IDX_9cb868c2e2862862eafa4fe748\` (\`age\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`genres\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(256) NOT NULL, UNIQUE INDEX \`IDX_f105f8230a83b86a346427de94\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`platforms\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(256) NOT NULL, UNIQUE INDEX \`IDX_6add27e349b6905c85e016fa2c\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`reviewers\` (\`id\` varchar(36) NOT NULL, \`temporaryPassword\` varchar(60) NOT NULL DEFAULT '', \`tempPasswordTime\` datetime NULL, \`createdAtUtcTime\` datetime NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(60) NOT NULL, \`email\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`reviews\` (\`id\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`stars\` smallint NOT NULL, \`gameId\` varchar(36) NULL, \`reviewerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`games_platforms_platforms\` (\`gamesId\` varchar(36) NOT NULL, \`platformsId\` varchar(36) NOT NULL, INDEX \`IDX_4b21c6613c6f02c52206dababb\` (\`gamesId\`), INDEX \`IDX_ff408be3cb15c2c316365ff574\` (\`platformsId\`), PRIMARY KEY (\`gamesId\`, \`platformsId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`games_genres_genres\` (\`gamesId\` varchar(36) NOT NULL, \`genresId\` varchar(36) NOT NULL, INDEX \`IDX_d3ac65ea9002de25d3d841d2b6\` (\`gamesId\`), INDEX \`IDX_5d59ed8cbec8cc23ca2c251545\` (\`genresId\`), PRIMARY KEY (\`gamesId\`, \`genresId\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`games\` ADD CONSTRAINT \`FK_c01e7e1e559de1afdfa0dd79e4f\` FOREIGN KEY (\`ageRatingId\`) REFERENCES \`ageRatings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_b1fad171e95a3e00bd06bbbbf79\` FOREIGN KEY (\`gameId\`) REFERENCES \`games\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_f9238c3e3739dc40322f577fc46\` FOREIGN KEY (\`reviewerId\`) REFERENCES \`reviewers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`games_platforms_platforms\` ADD CONSTRAINT \`FK_4b21c6613c6f02c52206dababb4\` FOREIGN KEY (\`gamesId\`) REFERENCES \`games\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`games_platforms_platforms\` ADD CONSTRAINT \`FK_ff408be3cb15c2c316365ff574e\` FOREIGN KEY (\`platformsId\`) REFERENCES \`platforms\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`games_genres_genres\` ADD CONSTRAINT \`FK_d3ac65ea9002de25d3d841d2b62\` FOREIGN KEY (\`gamesId\`) REFERENCES \`games\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE \`games_genres_genres\` ADD CONSTRAINT \`FK_5d59ed8cbec8cc23ca2c2515455\` FOREIGN KEY (\`genresId\`) REFERENCES \`genres\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`games_genres_genres\` DROP FOREIGN KEY \`FK_5d59ed8cbec8cc23ca2c2515455\``)
    await queryRunner.query(`ALTER TABLE \`games_genres_genres\` DROP FOREIGN KEY \`FK_d3ac65ea9002de25d3d841d2b62\``)
    await queryRunner.query(
      `ALTER TABLE \`games_platforms_platforms\` DROP FOREIGN KEY \`FK_ff408be3cb15c2c316365ff574e\``
    )
    await queryRunner.query(
      `ALTER TABLE \`games_platforms_platforms\` DROP FOREIGN KEY \`FK_4b21c6613c6f02c52206dababb4\``
    )
    await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_f9238c3e3739dc40322f577fc46\``)
    await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_b1fad171e95a3e00bd06bbbbf79\``)
    await queryRunner.query(`ALTER TABLE \`games\` DROP FOREIGN KEY \`FK_c01e7e1e559de1afdfa0dd79e4f\``)
    await queryRunner.query(`DROP INDEX \`IDX_5d59ed8cbec8cc23ca2c251545\` ON \`games_genres_genres\``)
    await queryRunner.query(`DROP INDEX \`IDX_d3ac65ea9002de25d3d841d2b6\` ON \`games_genres_genres\``)
    await queryRunner.query(`DROP TABLE \`games_genres_genres\``)
    await queryRunner.query(`DROP INDEX \`IDX_ff408be3cb15c2c316365ff574\` ON \`games_platforms_platforms\``)
    await queryRunner.query(`DROP INDEX \`IDX_4b21c6613c6f02c52206dababb\` ON \`games_platforms_platforms\``)
    await queryRunner.query(`DROP TABLE \`games_platforms_platforms\``)
    await queryRunner.query(`DROP TABLE \`reviews\``)
    await queryRunner.query(`DROP TABLE \`reviewers\``)
    await queryRunner.query(`DROP INDEX \`IDX_6add27e349b6905c85e016fa2c\` ON \`platforms\``)
    await queryRunner.query(`DROP TABLE \`platforms\``)
    await queryRunner.query(`DROP INDEX \`IDX_f105f8230a83b86a346427de94\` ON \`genres\``)
    await queryRunner.query(`DROP TABLE \`genres\``)
    await queryRunner.query(`DROP INDEX \`IDX_9cb868c2e2862862eafa4fe748\` ON \`ageRatings\``)
    await queryRunner.query(`DROP TABLE \`ageRatings\``)
    await queryRunner.query(`DROP TABLE \`games\``)
  }
}
