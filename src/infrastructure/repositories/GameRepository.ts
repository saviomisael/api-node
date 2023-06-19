import { AgeRating, Game, Genre, Platform } from '$/domain/entities'
import { Review } from '$/domain/entities/Review'
import { type IGameRepository } from '$/domain/repositories'
import { Owner } from '$/domain/value-objects/Owner'
import { type Connection } from 'mysql2/promise'
import { AppDataSource } from '../AppDataSource'
import { DBConnection } from '../DBConnection'
import { maxGamesPerPage } from '../constants'
import { type ReviewRowData } from '../row-data/ReviewRowData'

export class GameRepository implements IGameRepository {
  private connection!: Connection
  private readonly gameRepository = AppDataSource.getRepository(Game)
  private readonly platformRepository = AppDataSource.getRepository(Platform)
  private readonly genreRepository = AppDataSource.getRepository(Genre)
  private readonly ageRepository = AppDataSource.getRepository(AgeRating)

  async getById(id: string): Promise<Game | null> {
    // TODO get reviews
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: {
        ageRating: true,
        platforms: true,
        genres: true
      }
    })

    return game
  }

  async create(game: Game): Promise<void> {
    const platforms = []
    const genres = []

    for (const platform of game.platforms) {
      const platformFromDB = await this.platformRepository.findOne({ where: { id: platform.id } })

      if (platformFromDB != null) {
        platforms.push(platformFromDB)
      }
    }

    for (const genre of game.genres) {
      const genreFromDB = await this.platformRepository.findOne({ where: { id: genre.id } })

      if (genreFromDB != null) {
        genres.push(genreFromDB)
      }
    }
    const age = await this.ageRepository.findOne({ where: { id: game.ageRating.id } })

    if (age != null) {
      game.platforms = platforms
      game.genres = genres
      game.ageRating = age

      await this.gameRepository.save(game)
    }
  }

  async updateGame(game: Game): Promise<void> {
    await this.create(game)
  }

  async deleteGameById(gameId: string): Promise<void> {
    await this.gameRepository.delete(gameId)
  }

  async getAll(page: number, sortType: 'releaseDate', sortOrder: 'ASC' | 'DESC'): Promise<Game[]> {
    const orders = {
      releaseDate: {
        releaseDate: sortOrder
      }
    }

    return await this.gameRepository.find({
      relations: {
        ageRating: true,
        platforms: true,
        genres: true
      },
      order: orders[sortType],
      take: maxGamesPerPage,
      skip: page < 2 ? 0 : (page - 1) * maxGamesPerPage
    })
  }

  async searchByTerm(term: string, page: number, sortType: 'releaseDate', sortOrder: 'ASC' | 'DESC'): Promise<Game[]> {
    term = `+${term}`

    const orders = {
      releaseDate: 'games_searched.releaseDate'
    }

    return await this.gameRepository
      .createQueryBuilder('games_searched')
      .innerJoinAndSelect('games.platforms', 'platforms')
      .innerJoinAndSelect('games.genres', 'genres')
      .innerJoinAndSelect('games.ageRating', 'age')
      .select()
      .where('MATCH(games_searched.name) AGAINST (:query IN BOOLEAN MODE)', { query: term })
      .orWhere('OR MATCH(platforms.name) AGAINST (:query IN BOOLEAN MODE)', { query: term })
      .orWhere('OR MATCH(genres.name) AGAINST (:query IN BOOLEAN MODE)', { query: term })
      .orderBy(`${orders[sortType]}`, sortOrder)
      .skip(page < 2 ? 0 : (page - 1) * maxGamesPerPage)
      .take(maxGamesPerPage)
      .getMany()
  }

  async getMaxPagesBySearch(term: string): Promise<number> {
    term = `+${term}`

    const count = await this.gameRepository
      .createQueryBuilder('games_searched')
      .innerJoinAndSelect('games.platforms', 'platforms')
      .innerJoinAndSelect('games.genres', 'genres')
      .innerJoinAndSelect('games.ageRating', 'age')
      .select()
      .where('MATCH(games_searched.name) AGAINST (:query IN BOOLEAN MODE)', { query: term })
      .orWhere('OR MATCH(platforms.name) AGAINST (:query IN BOOLEAN MODE)', { query: term })
      .orWhere('OR MATCH(genres.name) AGAINST (:query IN BOOLEAN MODE)', { query: term })
      .getCount()

    return Math.ceil(count / maxGamesPerPage)
  }

  async getMaxPages(): Promise<number> {
    const count = await this.gameRepository.count()

    return Math.ceil(count / maxGamesPerPage)
  }

  async createReview(review: Review): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute(
      'INSERT INTO reviews (id, description, stars, fk_game, fk_reviewer) VALUES (?, ?, ?, ?, ?)',
      [review.getId(), review.getDescription(), review.getStars(), review.getGameId(), review.getReviewerId()]
    )
  }

  async verifyGameAlreadyExists(id: string): Promise<boolean> {
    const game = await this.gameRepository.findOne({ where: { id } })

    return game != null
  }

  async updateReview(review: Review): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute('UPDATE reviews SET description = ?, stars = ? WHERE id = ?', [
      review.getDescription(),
      review.getStars(),
      review.getId()
    ])
  }

  async checkReviewExists(reviewId: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT id FROM reviews WHERE id = ?', [reviewId])

    const rows = result[0] as any[]

    return rows.length > 0
  }

  async getUserForReview(reviewId: string): Promise<string> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT fk_reviewer FROM reviews WHERE id = ?', [reviewId])

    const rows = result[0] as any[]

    return rows[0].fk_reviewer
  }

  async checkReviewerHasReviewByGame(reviewerId: string, gameId: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT id FROM reviews WHERE fk_game = ? AND fk_reviewer = ?', [
      gameId,
      reviewerId
    ])

    const rows = result[0] as any[]

    return rows.length > 0
  }

  async getReviewsByGame(gameId: string): Promise<Review[]> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      `
      SELECT
      r.id,
      r.description,
      r.stars, r.fk_game,
      r.fk_reviewer,
      rv.id AS owner_id,
      rv.username
      FROM reviews AS r
      JOIN reviewers AS rv ON r.fk_reviewer = rv.id
      WHERE r.fk_game = ?`,
      [gameId]
    )

    const rows = result[0] as ReviewRowData[]

    return rows.map((x) => {
      const owner = new Owner()
      owner.id = x.owner_id
      owner.username = x.username

      const review = new Review(x.description, x.stars, x.fk_game, x.fk_reviewer)
      review.setOwner(owner)
      review.setId(x.id)

      return review
    })
  }
}
