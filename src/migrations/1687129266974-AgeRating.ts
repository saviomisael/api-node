import { Table, type MigrationInterface, type QueryRunner } from 'typeorm'

export class AgeRating1687129266974 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'ageRatings',
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true,
          length: '36'
        },
        {
          name: 'age',
          type: 'varchar',
          length: '3'
        },
        {
          name: 'description',
          type: 'varchar',
          length: '256'
        }
      ]
    })

    await queryRunner.createTable(table)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ageRatings')
  }
}
