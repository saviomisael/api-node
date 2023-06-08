import { type Game } from '$/domain/entities'
import {
  type IAgeRatingRepository,
  type IGameRepository,
  type IGenreRepository,
  type IPlatformRepository
} from '$/domain/repositories'
import { AgeRatingRepository, GenreRepository, PlatformRepository } from '$/infrastructure/repositories'
import { GameRepository } from '$/infrastructure/repositories/GameRepository'
import { AgeNotExistsError } from '../errors/AgeNotExistsError'
import { GenreNotExistsError } from '../errors/GenreNotExistsError'
import { PlatformNotExistsError } from '../errors/PlatformNotExistsError'

export class GameService {
  private readonly gameRepository: IGameRepository = new GameRepository()
  private readonly ageRepository: IAgeRatingRepository = new AgeRatingRepository()
  private readonly platformRepository: IPlatformRepository = new PlatformRepository()
  private readonly genreRepository: IGenreRepository = new GenreRepository()

  async createGame (game: Game): Promise<Game | null> {
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

    await this.gameRepository.create(game)
    const newGame = await this.gameRepository.getById(game.id)

    return newGame
  }
}