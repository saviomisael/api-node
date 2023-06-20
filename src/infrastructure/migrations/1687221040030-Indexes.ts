import { TableIndex, type MigrationInterface, type QueryRunner } from 'typeorm'

export class Indexes1687221040030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'genres',
      new TableIndex({
        name: 'name_genres_idx',
        columnNames: ['name'],
        isFulltext: true
      })
    )

    await queryRunner.createIndex(
      'platforms',
      new TableIndex({
        name: 'name_platforms_idx',
        columnNames: ['name'],
        isFulltext: true
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
    await queryRunner.dropIndex('reviewers', 'email_reviewers_idx')
    await queryRunner.dropIndex('reviewers', 'username_reviewers_idx')
    await queryRunner.dropIndex('games', 'name_games_idx')
    await queryRunner.dropIndex('platforms', 'name_platforms_idx')
    await queryRunner.dropIndex('genres', 'name_genres_idx')
  }
}
