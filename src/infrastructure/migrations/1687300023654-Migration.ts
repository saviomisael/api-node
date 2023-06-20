import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migration1687300023654 implements MigrationInterface {
  name = 'Migration1687300023654'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE FULLTEXT INDEX \`name_games_idx\` ON \`games\` (\`name\`)`)
    await queryRunner.query(`CREATE FULLTEXT INDEX \`genre_name_idx\` ON \`genres\` (\`name\`)`)
    await queryRunner.query(`CREATE FULLTEXT INDEX \`platform_name_idx\` ON \`platforms\` (\`name\`)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`platform_name_idx\` ON \`platforms\``)
    await queryRunner.query(`DROP INDEX \`genre_name_idx\` ON \`genres\``)
    await queryRunner.query(`DROP INDEX \`name_games_idx\` ON \`games\``)
  }
}
