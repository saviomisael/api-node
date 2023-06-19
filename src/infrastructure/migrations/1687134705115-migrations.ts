import { Table, TableIndex, type MigrationInterface, type QueryRunner } from 'typeorm'

export class Migrations1687134705115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'platforms',
        columns: [
          {
            type: 'varchar',
            length: '36',
            name: 'id'
          },
          {
            type: 'varchar',
            length: '256',
            name: 'name'
          }
        ]
      })
    )

    await queryRunner.createIndex(
      'platforms',
      new TableIndex({
        columnNames: ['name'],
        isFulltext: true,
        name: 'platform_name_idx'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('platforms')
  }
}
