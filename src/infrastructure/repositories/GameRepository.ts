import { type Game } from '$/domain/entities'
import { type Review } from '$/domain/entities/Review'
import { type IGameRepository } from '$/domain/repositories'
import { type Connection } from 'mysql2/promise'
import { DBConnection } from '../DBConnection'
import { maxGamesPerPage } from '../constants'
import { GameNotExistsError } from '../errors/GameNotExistsError'
import { GameRowDataMapper } from '../mapper/GameRowDataMapper'
import { type GameRowData } from '../row-data/GameRowData'

export class GameRepository implements IGameRepository {
  private connection!: Connection

  async getById(gameId: string): Promise<Game | null> {
    this.connection = await DBConnection.getConnection()

    const results = await this.connection.execute(
      `
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
    `,
      [gameId]
    )

    const rows = results[0] as any[]

    if (rows.length === 0) return null

    const game = GameRowDataMapper.toEntity(rows[0] as GameRowData)

    return game
  }

  async create(game: Game): Promise<void> {
    this.connection = await DBConnection.getConnection()

    const pipeline: Array<Promise<any>> = [
      this.connection.execute(
        `
      INSERT INTO games (id, price, name, description, releaseDate, fkAgeRating)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
        [game.id, game.getPrice(), game.getName(), game.getDescription(), game.getReleaseDate(), game.getAgeRating().id]
      )
    ]

    for (const platform of [...game.getPlatforms()]) {
      pipeline.push(
        this.connection.execute('INSERT INTO games_platforms (fk_platform, fk_game) VALUES (?, ?)', [
          platform.id,
          game.id
        ])
      )
    }

    for (const genre of [...game.getGenres()]) {
      pipeline.push(
        this.connection.execute('INSERT INTO games_genres (fk_genre, fk_game) VALUES (?, ?)', [genre.id, game.id])
      )
    }

    await Promise.all(pipeline)
  }

  async updateGame(newGame: Game): Promise<void> {
    this.connection = await DBConnection.getConnection()

    const pipeline = [this.connection.execute('DELETE FROM games_platforms WHERE fk_game = ?', [newGame.id])]

    for (const platform of [...newGame.getPlatforms()]) {
      pipeline.push(
        this.connection.execute('INSERT INTO games_platforms (fk_platform, fk_game) VALUES (?, ?)', [
          platform.id,
          newGame.id
        ])
      )
    }
    pipeline.push(this.connection.execute('DELETE FROM games_genres WHERE fk_game = ?', [newGame.id]))

    for (const genre of [...newGame.getGenres()]) {
      pipeline.push(
        this.connection.execute('INSERT INTO games_genres (fk_genre, fk_game) VALUES (?, ?)', [genre.id, newGame.id])
      )
    }
    pipeline.push(
      this.connection.execute(
        `
      UPDATE games
      SET price = ?,
      name = ?,
      description = ?,
      releaseDate = ?,
      fkAgeRating = ?
      WHERE id = ?
    `,
        [
          newGame.getPrice(),
          newGame.getName(),
          newGame.getDescription(),
          newGame.getReleaseDate(),
          newGame.getAgeRating().id,
          newGame.id
        ]
      )
    )

    await Promise.all([...pipeline])
  }

  async deleteGameById(gameId: string): Promise<void> {
    this.connection = await DBConnection.getConnection()

    const pipeline = [this.connection.execute('DELETE FROM games_platforms WHERE fk_game = ?', [gameId])]

    pipeline.push(this.connection.execute('DELETE FROM games_genres WHERE fk_game = ?', [gameId]))

    pipeline.push(this.connection.execute('DELETE FROM games WHERE id = ?', [gameId]))

    await Promise.all([...pipeline])
  }

  async getAll(page: number, sortType: 'releaseDate', sortOrder: 'ASC' | 'DESC'): Promise<Game[]> {
    this.connection = await DBConnection.getConnection()

    const orders = {
      releaseDate: 'DATE(g.releaseDate)'
    }

    const query = `
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
      GROUP BY g.id
      ORDER BY ${orders[sortType]} ${sortOrder}
      LIMIT ${page < 2 ? 0 : (page - 1) * maxGamesPerPage},${maxGamesPerPage}
    `

    const result = await this.connection.execute(query)

    const rows = result[0] as GameRowData[]

    return rows.map((x) => GameRowDataMapper.toEntity(x))
  }

  async searchByTerm(term: string, page: number, sortType: 'releaseDate', sortOrder: 'ASC' | 'DESC'): Promise<Game[]> {
    this.connection = await DBConnection.getConnection()

    term = `+${term}`

    const orders = {
      releaseDate: 'DATE(g.releaseDate)'
    }

    const query = `
      SELECT g.id
      FROM games AS g
      JOIN ageRatings AS ar ON g.fkAgeRating = ar.id
      JOIN games_genres AS gg ON gg.fk_game = g.id
      JOIN genres AS gr ON gg.fk_genre = gr.id
      JOIN games_platforms AS gp ON gp.fk_game = g.id
      JOIN platforms AS p ON gp.fk_platform = p.id
      WHERE MATCH(gr.name) AGAINST (? IN BOOLEAN MODE)
      OR MATCH(g.name) AGAINST (? IN BOOLEAN MODE)
      OR MATCH(p.name) AGAINST (? IN BOOLEAN MODE)
      GROUP BY g.id
      ORDER BY ${orders[sortType]} ${sortOrder}
      LIMIT ${page < 2 ? 0 : (page - 1) * maxGamesPerPage},${maxGamesPerPage}
    `

    const result = await this.connection.execute(query, [term, term, term])

    const rows = result[0] as any[]

    const pipeline: Array<Promise<Game | null>> = []

    for (const row of rows) {
      pipeline.push(this.getById(row.id as string))
    }

    const gamesPromise = await Promise.all([...pipeline])

    const games: Game[] = []

    for (const game of gamesPromise) {
      if (game !== null) games.push(game)
    }

    const hasNull = gamesPromise.length !== games.length

    if (hasNull) {
      throw new GameNotExistsError()
    }

    return games
  }

  async getMaxPagesBySearch(term: string): Promise<number> {
    this.connection = await DBConnection.getConnection()

    term = `+${term}`

    const result = await this.connection.execute(
      `
        SELECT COUNT(DISTINCT g.id) AS numGames
        FROM games AS g
        JOIN ageRatings AS ar ON g.fkAgeRating = ar.id
        JOIN games_genres AS gg ON gg.fk_game = g.id
        JOIN genres AS gr ON gg.fk_genre = gr.id
        JOIN games_platforms AS gp ON gp.fk_game = g.id
        JOIN platforms AS p ON gp.fk_platform = p.id
        WHERE MATCH(gr.name) AGAINST (? IN BOOLEAN MODE)
        OR MATCH(g.name) AGAINST (? IN BOOLEAN MODE)
        OR MATCH(p.name) AGAINST (? IN BOOLEAN MODE)
      `,
      [term, term, term]
    )

    const rows = result[0] as any[]

    return Math.ceil((rows[0].numGames as number) / maxGamesPerPage)
  }

  async getMaxPages(): Promise<number> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT COUNT(id) AS numGames FROM games')

    const rows = result[0] as any[]

    return Math.ceil((rows[0].numGames as number) / maxGamesPerPage)
  }

  async createReview(review: Review): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute(
      'INSERT INTO reviews (id, description, stars, fk_game, fk_reviewer) VALUES (?, ?, ?, ?, ?)',
      [review.getId(), review.getDescription(), review.getStars(), review.getGameId(), review.getReviewerId()]
    )
  }

  async verifyGameAlreadyExists(gameId: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT id FROM games WHERE id = ?', [gameId])

    const rows = result[0] as any[]

    return rows.length > 0
  }

  async updateReview(review: Review): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute('UPDATE reviews SET description = ?, stars = ? WHERE id = ?', [
      review.getDescription(),
      review.getStars(),
      review.getId()
    ])
  }
}
