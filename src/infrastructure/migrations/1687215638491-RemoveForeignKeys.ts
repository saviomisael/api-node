import { TableForeignKey, type MigrationInterface, type QueryRunner } from 'typeorm'

export class RemoveForeignKeys1687215638491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('games_genres_genres')

    if (table != null) {
      for (const foreignKey of table.foreignKeys) {
        await queryRunner.dropForeignKey(table, foreignKey)
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('games_genres_genres')

    if (table != null) {
      await queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ['genresId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'genres'
        })
      )

      await queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ['gamesId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'games'
        })
      )
    }
  }
}
