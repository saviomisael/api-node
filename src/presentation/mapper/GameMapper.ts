import { AgeRating, Game, Genre, Platform } from '$/domain/entities'
import { type CreateGameDTO } from '../dto/CreateGameDTO'
import { GameResponseDTO } from '../dto/GameResponseDTO'
import { type UpdateGameDTO } from '../dto/UpdateGameDTO'

export class GameMapper {
  private constructor () {}

  static toEntity (dto: CreateGameDTO): Game {
    const ageRating = new AgeRating('', '')
    ageRating.id = dto.ageRatingId

    const game = new Game(dto.name, dto.price, dto.description, new Date(dto.releaseDate), ageRating)

    for (const genreId of dto.genres) {
      const genre = new Genre('')
      genre.id = genreId
      game.addGenre(genre)
    }

    for (const platformId of dto.platforms) {
      const platform = new Platform('')
      platform.id = platformId
      game.addPlatform(platform)
    }

    return game
  }

  static fromUpdateGameDtoToEntity (dto: UpdateGameDTO): Game {
    const ageRating = new AgeRating('', '')
    ageRating.id = dto.ageRatingId

    const game = new Game(dto.name, dto.price, dto.description, new Date(dto.releaseDate), ageRating)
    game.id = dto.id

    for (const genreId of dto.genres) {
      const genre = new Genre('')
      genre.id = genreId
      game.addGenre(genre)
    }

    for (const platformId of dto.platforms) {
      const platform = new Platform('')
      platform.id = platformId
      game.addPlatform(platform)
    }

    return game
  }

  static fromEntityToGameResponse (game: Game): GameResponseDTO {
    const gameDTO = new GameResponseDTO()
    gameDTO.id = game.id
    gameDTO.ageRating = game.getAgeRating()
    gameDTO.description = game.getDescription()
    gameDTO.genres = [...game.getGenres()]
    gameDTO.name = game.getName()
    gameDTO.platforms = [...game.getPlatforms()]
    gameDTO.price = game.getPrice()
    gameDTO.releaseDate = game.getReleaseDate().toISOString()

    return gameDTO
  }
}
