import { Table, TableIndex, type MigrationInterface, type QueryRunner } from 'typeorm'

export class Game1687192109425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'games',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'varchar',
            length: '36',
            isNullable: false
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false
          },
          {
            name: 'price',
            type: 'numeric',
            isNullable: false,
            precision: 10,
            scale: 2
          },
          {
            name: 'ageRatingsId',
            type: 'varchar',
            length: '36',
            isNullable: false
          }
        ],
        foreignKeys: [
          {
            columnNames: ['ageRatingsId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'ageRatings'
          }
        ]
      })
    )

    await queryRunner.createIndex(
      'games',
      new TableIndex({
        name: 'name_games_idx',
        columnNames: ['name'],
        isFulltext: true
      })
    )

    await queryRunner.createTable(
      new Table({
        name: 'games_genres_genres',
        columns: [
          {
            name: 'genresId',
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
        ],
        foreignKeys: [
          {
            columnNames: ['genresId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'genres'
          },
          {
            columnNames: ['gamesId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'games'
          }
        ]
      })
    )

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
        ],
        foreignKeys: [
          {
            columnNames: ['platformsId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'platforms'
          },
          {
            columnNames: ['gamesId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'games'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('games_platforms_platforms')
    await queryRunner.dropTable('games_genres_genres')
    await queryRunner.dropTable('games')
  }
}
