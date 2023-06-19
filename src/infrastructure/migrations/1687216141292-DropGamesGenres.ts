import { Table, type MigrationInterface, type QueryRunner } from 'typeorm'

export class DropGamesGenres1687216141292 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('games_genres_genres')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
        ]
      })
    )
  }
}
