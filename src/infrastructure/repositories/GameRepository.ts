import { AgeRating, Game, Genre, Platform, Reviewer } from '$/domain/entities'
import { Review } from '$/domain/entities/Review'
import { type IGameRepository } from '$/domain/repositories'
import { Owner } from '$/domain/value-objects/Owner'
import { AppDataSource } from '../AppDataSource'
import { maxGamesPerPage } from '../constants'

export class GameRepository implements IGameRepository {
  private readonly gameRepository = AppDataSource.getRepository(Game)
  private readonly reviewRepository = AppDataSource.getRepository(Review)
  private readonly reviewerRepository = AppDataSource.getRepository(Reviewer)

  async getById(id: string): Promise<Game | null> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: {
        ageRating: true,
        platforms: true,
        genres: true,
        reviews: true
      }
    })

    return game
  }

  async create(game: Game): Promise<void> {
    const age = new AgeRating()
    age.id = game.ageRating.id

    const genres = game.genres.map((x) => {
      const genre = new Genre()
      genre.id = x.id
      return genre
    })

    const platforms = game.platforms.map((x) => {
      const platform = new Platform()
      platform.id = x.id
      return platform
    })
    game.ageRating = age
    game.genres = genres
    game.platforms = platforms

    await this.gameRepository.save(game)
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
    const game = await this.gameRepository.findOne({ where: { id: review.game.id } })
    const reviewer = await this.reviewerRepository.findOne({ where: { id: review.reviewer.id } })

    if (game != null && reviewer != null) {
      review.game = game
      review.reviewer = reviewer
      await this.reviewRepository.save(review)
    }
  }

  async verifyGameAlreadyExists(id: string): Promise<boolean> {
    const game = await this.gameRepository.findOne({ where: { id } })

    return game != null
  }

  async updateReview(review: Review): Promise<void> {
    await this.createReview(review)
  }

  async checkReviewExists(id: string): Promise<boolean> {
    const review = await this.reviewRepository.findOne({ where: { id } })

    return review != null
  }

  async getUserForReview(id: string): Promise<string> {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: { reviewer: true } })

    if (review == null) return ''

    return review.reviewer.id
  }

  async checkReviewerHasReviewByGame(reviewerId: string, gameId: string): Promise<boolean> {
    const review = await this.reviewRepository.findOne({
      where: { game: { id: gameId }, reviewer: { id: reviewerId } }
    })

    return review != null
  }

  async getReviewsByGame(gameId: string): Promise<Review[]> {
    const reviews = await this.reviewRepository.find({ where: { game: { id: gameId } }, relations: { reviewer: true } })

    if (reviews === undefined) return []

    return reviews.map((x) => {
      const owner = new Owner()
      owner.id = x.reviewer.id
      owner.username = x.reviewer.username

      x.setOwner(owner)

      return x
    })
  }
}
