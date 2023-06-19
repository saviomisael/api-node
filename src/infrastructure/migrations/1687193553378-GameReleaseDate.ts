import { TableColumn, type MigrationInterface, type QueryRunner } from 'typeorm'

export class GameReleaseDate1687193553378 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'games',
      new TableColumn({
        name: 'releaseDate',
        type: 'datetime',
        isNullable: false
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('games', 'releaseDate')
  }
}
