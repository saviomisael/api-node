import { Table, TableIndex, type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migrations1687132629344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'genres',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            length: '36'
          },
          {
            name: 'name',
            type: 'varchar',
            length: '256'
          }
        ]
      })
    )

    await queryRunner.createIndex(
      'genres',
      new TableIndex({
        isFulltext: true,
        columnNames: ['name'],
        name: 'genre_name_idx'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('genres')
  }
}
