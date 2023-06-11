import { type Game } from '$/domain/entities'
import {
  type IAgeRatingRepository,
  type IGameRepository,
  type IGenreRepository,
  type IPlatformRepository
} from '$/domain/repositories'
import { AgeRatingRepository, GameRepository, GenreRepository, PlatformRepository } from '$/infrastructure/repositories'
import { AgeNotExistsError } from '../errors/AgeNotExistsError'
import { GameNotExistsError } from '../errors/GameNotExistsError'
import { GenreNotExistsError } from '../errors/GenreNotExistsError'
import { PlatformNotExistsError } from '../errors/PlatformNotExistsError'

export class GameService {
  private readonly gameRepository: IGameRepository = new GameRepository()
  private readonly ageRepository: IAgeRatingRepository = new AgeRatingRepository()
  private readonly platformRepository: IPlatformRepository = new PlatformRepository()
  private readonly genreRepository: IGenreRepository = new GenreRepository()

  async createGame(game: Game): Promise<Game | null> {
    const ageIdExists = await this.ageRepository.ageIdExists(game.getAgeRating().id)

    if (!ageIdExists) {
      throw new AgeNotExistsError()
    }

    for (const platform of game.getPlatforms()) {
      const platformExists = await this.platformRepository.platformIdExists(platform.id)

      if (!platformExists) {
        throw new PlatformNotExistsError(platform.id)
      }
    }

    for (const genre of game.getGenres()) {
      const genreExists = await this.genreRepository.getGenreById(genre.id)

      if (genreExists == null) {
        throw new GenreNotExistsError(genre.id)
      }
    }

    const [, newGame] = await Promise.all([this.gameRepository.create(game), this.gameRepository.getById(game.id)])

    return newGame
  }

  async getGameById(gameId: string): Promise<Game | null> {
    const game = await this.gameRepository.getById(gameId)
    return game
  }

  async updateGameById(game: Game): Promise<Game | null> {
    const ageIdExists = await this.ageRepository.ageIdExists(game.getAgeRating().id)

    if (!ageIdExists) {
      throw new AgeNotExistsError()
    }

    for (const platform of game.getPlatforms()) {
      const platformExists = await this.platformRepository.platformIdExists(platform.id)

      if (!platformExists) {
        throw new PlatformNotExistsError(platform.id)
      }
    }

    for (const genre of game.getGenres()) {
      const genreExists = await this.genreRepository.getGenreById(genre.id)

      if (genreExists == null) {
        throw new GenreNotExistsError(genre.id)
      }
    }

    const [, updatedGame] = await Promise.all([
      this.gameRepository.updateGame(game),
      this.gameRepository.getById(game.id)
    ])

    return updatedGame
  }

  async deleteGameById(gameId: string): Promise<void> {
    const game = await this.gameRepository.getById(gameId)

    if (game == null) {
      throw new GameNotExistsError()
    }

    await this.gameRepository.deleteGameById(gameId)
  }

  async getAll(page: number, sortType: 'releaseDate', sortOrder: 'ASC' | 'DESC'): Promise<Game[]> {
    const allGames = await this.gameRepository.getAll(page, sortType, sortOrder)

    return allGames
  }
}
