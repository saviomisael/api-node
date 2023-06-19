import { Table, TableIndex, type MigrationInterface, type QueryRunner } from 'typeorm'

export class Reviewer1687184733529 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reviewers',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'varchar',
            length: '36',
            isNullable: false
          },
          {
            name: 'temporaryPassword',
            type: 'varchar',
            length: '60',
            default: "''"
          },
          {
            name: 'username',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'password',
            type: 'varchar',
            length: '60',
            isNullable: false
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'tempPasswordTime',
            type: 'datetime',
            isNullable: true,
            default: 'null'
          },
          {
            name: 'createdAtUtcTime',
            type: 'datetime',
            isNullable: false
          }
        ]
      })
    )

    await queryRunner.createIndex(
      'reviewers',
      new TableIndex({
        name: 'username_reviewers_idx',
        columnNames: ['username']
      })
    )

    await queryRunner.createIndex(
      'reviewers',
      new TableIndex({
        name: 'email_reviewers_idx',
        columnNames: ['email']
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reviewers')
  }
}
