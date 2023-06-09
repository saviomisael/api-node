import { type Game } from '$/domain/entities'
import { type IGameRepository } from '$/domain/repositories'
import { type Connection } from 'mysql2/promise'
import { DBConnection } from '../DBConnection'
import { GameRowDataMapper } from '../mapper/GameRowDataMapper'
import { type GameRowData } from '../row-data/GameRowData'

export class GameRepository implements IGameRepository {
  private connection!: Connection

  async getById (gameId: string): Promise<Game | null> {
    this.connection = await DBConnection.getConnection()

    const results = await this.connection.execute(`
      SELECT g.id AS game_id,
      g.name AS game_name,
      g.description AS game_description,
      g.price AS game_price,
      g.releaseDate,
      ar.id AS age_rating_id,
      ar.age,
      ar.description AS age_rating_description,
      GROUP_CONCAT(DISTINCT gr.id) AS genre_ids,
      GROUP_CONCAT(DISTINCT gr.name) AS genre_names,
      GROUP_CONCAT(DISTINCT p.id) AS platform_ids,
      GROUP_CONCAT(DISTINCT p.name) AS platform_names
      FROM games AS g
      JOIN ageRatings AS ar ON g.fkAgeRating = ar.id
      JOIN games_genres AS gg ON gg.fk_game = g.id
      JOIN genres AS gr ON gg.fk_genre = gr.id
      JOIN games_platforms AS gp ON gp.fk_game = g.id
      JOIN platforms AS p ON gp.fk_platform = p.id
      WHERE g.id = ?
      GROUP BY g.id
    `, [gameId])

    const rows = results[0] as any[]

    if (rows.length === 0) return null

    const game = GameRowDataMapper.toEntity(rows[0] as GameRowData)

    return game
  }

  async create (game: Game): Promise<void> {
    this.connection = await DBConnection.getConnection()

    const pipeline: Array<Promise<any>> = [this.connection.execute(`
      INSERT INTO games (id, price, name, description, releaseDate, fkAgeRating)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      game.id,
      game.getPrice(),
      game.getName(),
      game.getDescription(),
      game.getReleaseDate(),
      game.getAgeRating().id
    ])]

    for (const platform of [...game.getPlatforms()]) {
      pipeline.push(this.connection.execute('INSERT INTO games_platforms (fk_platform, fk_game) VALUES (?, ?)',
        [platform.id, game.id]))
    }

    for (const genre of [...game.getGenres()]) {
      pipeline.push(this.connection.execute('INSERT INTO games_genres (fk_genre, fk_game) VALUES (?, ?)',
        [genre.id, game.id]))
    }

    await Promise.all(pipeline)
  }

  async updateGame (newGame: Game): Promise<void> {
    this.connection = await DBConnection.getConnection()

    const pipeline = [this.connection.execute('DELETE FROM games_platforms WHERE fk_game = ?',
      [newGame.id]
    )]

    for (const platform of [...newGame.getPlatforms()]) {
      pipeline.push(this.connection.execute('INSERT INTO games_platforms (fk_platform, fk_game) VALUES (?, ?)',
        [platform.id, newGame.id]
      ))
    }
    pipeline.push(this.connection.execute('DELETE FROM games_genres WHERE fk_game = ?', [newGame.id]))

    for (const genre of [...newGame.getGenres()]) {
      pipeline.push(this.connection.execute('INSERT INTO games_genres (fk_genre, fk_game) VALUES (?, ?)',
        [genre.id, newGame.id]
      ))
    }
    pipeline.push(this.connection.execute(`
      UPDATE games
      SET price = ?,
      name = ?,
      description = ?,
      releaseDate = ?,
      fkAgeRating = ?
      WHERE id = ?
    `, [
      newGame.getPrice(),
      newGame.getName(),
      newGame.getDescription(),
      newGame.getReleaseDate(),
      newGame.getAgeRating().id,
      newGame.id
    ]))

    await Promise.all([...pipeline])
  }

  async deleteGameById (gameId: string): Promise<void> {
    this.connection = await DBConnection.getConnection()

    const pipeline = [this.connection.execute('DELETE FROM games_platforms WHERE fk_game = ?',
      [gameId]
    )]

    pipeline.push(this.connection.execute('DELETE FROM games_genres WHERE fk_game = ?', [gameId]))

    pipeline.push(this.connection.execute('DELETE FROM games WHERE id = ?', [gameId]))

    await Promise.all([...pipeline])
  }
}
