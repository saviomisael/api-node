import { Table, type MigrationInterface, type QueryRunner } from 'typeorm'

export class DropForeignKeysPlatforms1687219477404 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('games_platforms_platforms')

    if (table != null) {
      await queryRunner.dropForeignKeys('games_platforms_platforms', table.foreignKeys)

      await queryRunner.dropTable(table)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
}
