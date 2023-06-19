import { Table, type MigrationInterface, type QueryRunner } from 'typeorm'

export class Review1687202183708 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'varchar',
            length: '36',
            isNullable: false
          },
          {
            name: 'description',
            isNullable: false,
            type: 'text'
          },
          {
            name: 'stars',
            type: 'smallint',
            isNullable: false
          },
          {
            name: 'gamesId',
            type: 'varchar',
            length: '36',
            isNullable: false
          },
          {
            name: 'reviewersId',
            type: 'varchar',
            length: '36',
            isNullable: false
          }
        ],
        foreignKeys: [
          {
            columnNames: ['gamesId'],
            referencedTableName: 'games',
            referencedColumnNames: ['id']
          },
          {
            columnNames: ['reviewersId'],
            referencedTableName: 'reviewers',
            referencedColumnNames: ['id']
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('reviews')

    if (table?.foreignKeys != null) {
      for (const foreignKeys of table.foreignKeys) {
        await queryRunner.dropForeignKey(table, foreignKeys)
      }
    }

    await queryRunner.dropTable('reviews')
  }
}
