import { type GameResponseDTO } from '$/application/dto/GameResponseDTO'
import { Review, type Game } from '$/domain/entities'
import {
  type IAgeRatingRepository,
  type IGameRepository,
  type IGenreRepository,
  type IPlatformRepository
} from '$/domain/repositories'
import { GameNotExistsError } from '$/infrastructure/errors/GameNotExistsError'
import { AgeRatingRepository, GameRepository, GenreRepository, PlatformRepository } from '$/infrastructure/repositories'
import { type CacheService } from '$/infrastructure/services/CacheService'
import { CacheServiceFactory } from '$/infrastructure/services/CacheServiceFactory'
import { type SingleGameResponseDTO } from '../dto/SingleGameResponseDTO'
import {
  AgeNotExistsError,
  GenreNotExistsError,
  PlatformNotExistsError,
  ReviewNotFoundError,
  ReviewOwnerError,
  ReviewerAlreadyHasReviewError
} from '../errors'
import { GameMapper } from '../mapper/GameMapper'

export class GameService {
  private readonly gameRepository: IGameRepository = new GameRepository()
  private readonly ageRepository: IAgeRatingRepository = new AgeRatingRepository()
  private readonly platformRepository: IPlatformRepository = new PlatformRepository()
  private readonly genreRepository: IGenreRepository = new GenreRepository()
  private cacheService!: CacheService<GameResponseDTO[]>

  async createGame(game: Game): Promise<Game | null> {
    const ageIdExists = await this.ageRepository.ageIdExists(game.ageRating.id)

    if (!ageIdExists) {
      throw new AgeNotExistsError()
    }

    for (const platform of game.platforms) {
      const platformExists = await this.platformRepository.platformIdExists(platform.id)

      if (!platformExists) {
        throw new PlatformNotExistsError(platform.id)
      }
    }

    for (const genre of game.genres) {
      const genreExists = await this.genreRepository.getGenreById(genre.id)

      if (genreExists == null) {
        throw new GenreNotExistsError(genre.id)
      }
    }

    await this.gameRepository.create(game)

    return await this.gameRepository.getById(game.id)
  }

  async getGameById(gameId: string): Promise<SingleGameResponseDTO | null> {
    const game = await this.gameRepository.getById(gameId)

    if (game == null) return game

    return [game].map((x) => GameMapper.fromEntityToSingleGame(x))[0]
  }

  async updateGameById(game: Game): Promise<Game | null> {
    const ageIdExists = await this.ageRepository.ageIdExists(game.ageRating.id)

    if (!ageIdExists) {
      throw new AgeNotExistsError()
    }

    for (const platform of game.platforms) {
      const platformExists = await this.platformRepository.platformIdExists(platform.id)

      if (!platformExists) {
        throw new PlatformNotExistsError(platform.id)
      }
    }

    for (const genre of game.genres) {
      const genreExists = await this.genreRepository.getGenreById(genre.id)

      if (genreExists == null) {
        throw new GenreNotExistsError(genre.id)
      }
    }

    await this.gameRepository.updateGame(game)

    return await this.gameRepository.getById(game.id)
  }

  async deleteGameById(gameId: string): Promise<void> {
    const game = await this.gameRepository.getById(gameId)

    if (game == null) {
      throw new GameNotExistsError()
    }

    await this.gameRepository.deleteGameById(gameId)
  }

  async getAll(
    page: number,
    sortType: 'releaseDate' | 'reviewsCount',
    sortOrder: 'ASC' | 'DESC'
  ): Promise<GameResponseDTO[]> {
    this.cacheService = CacheServiceFactory.getGamesCacheService()

    const replacements = { page: String(page), sortType, sortOrder }
    let games = await this.cacheService.replaceKeys(replacements).getData()

    if (games != null) return games

    const gamesFromDB = await this.gameRepository.getAll(page, sortType, sortOrder)
    games = gamesFromDB.map((x) => GameMapper.fromEntityToGameResponse(x))
    await this.cacheService.replaceKeys(replacements).setData(games)

    return games
  }

  async searchByTerm(
    term: string,
    page: number,
    sortType: 'releaseDate',
    sortOrder: 'ASC' | 'DESC'
  ): Promise<GameResponseDTO[]> {
    this.cacheService = CacheServiceFactory.getGamesSearchCacheService()

    const replacements = { page: String(page), sortType, sortOrder, term }
    let games = await this.cacheService.replaceKeys(replacements).getData()

    if (games !== null) return games

    const gamesFromDB = await this.gameRepository.searchByTerm(term, page, sortType, sortOrder)

    games = gamesFromDB.map((x) => GameMapper.fromEntityToGameResponse(x))
    await this.cacheService.replaceKeys(replacements).setData(games)

    return games
  }

  async createReview(review: Review): Promise<void> {
    const gameExists = await this.gameRepository.verifyGameAlreadyExists(review.game.id)

    if (!gameExists) {
      throw new GameNotExistsError()
    }

    const reviewerAlreadyHasReview = await this.gameRepository.checkReviewerHasReviewByGame(
      review.reviewer.id,
      review.game.id
    )

    if (reviewerAlreadyHasReview) {
      throw new ReviewerAlreadyHasReviewError()
    }

    await this.gameRepository.createReview(review)
  }

  async updateReview(reviewId: string, description: string, stars: number, userId: string): Promise<void> {
    const reviewExists = await this.gameRepository.checkReviewExists(reviewId)

    if (!reviewExists) {
      throw new ReviewNotFoundError()
    }

    const user = await this.gameRepository.getUserForReview(reviewId)

    if (user !== userId) {
      throw new ReviewOwnerError()
    }

    const review = new Review()
    review.description = description
    review.stars = stars
    review.id = reviewId

    await this.gameRepository.updateReview(review)
  }

  async getGamesByUsername(username: string): Promise<Game[]> {
    return await this.gameRepository.getGamesByUsername(username)
  }
}
