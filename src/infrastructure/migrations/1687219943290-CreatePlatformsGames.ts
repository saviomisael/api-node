import { Table, type MigrationInterface, type QueryRunner } from 'typeorm'

export class CreatePlatformsGames1687219943290 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'games_platforms_platforms',
        columns: [
          {
            name: 'platformsId',
            type: 'varchar',
            length: '36',
            isNullable: false
          },
          {
            name: 'gamesId',
            type: 'varchar',
            length: '36',
            isNullable: false
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('games_platforms_platforms')
  }
}
