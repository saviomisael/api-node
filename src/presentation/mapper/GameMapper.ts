import { AgeRating, Game, Genre, Platform } from '$/domain/entities'
import { type CreateGameDTO } from '../dto/CreateGameDTO'
import { type UpdateGameDTO } from '../dto/UpdateGameDTO'

export class GameMapper {
  private constructor() {}

  static toEntity(dto: CreateGameDTO): Game {
    const ageRating = new AgeRating()
    ageRating.id = dto.ageRatingId

    const game = new Game(dto.name, dto.price, dto.description, new Date(dto.releaseDate), ageRating)

    for (const genreId of dto.genres) {
      const genre = new Genre()
      genre.id = genreId
      game.addGenre(genre)
    }

    for (const platformId of dto.platforms) {
      const platform = new Platform()
      platform.id = platformId
      game.addPlatform(platform)
    }

    return game
  }

  static fromUpdateGameDtoToEntity(dto: UpdateGameDTO): Game {
    const ageRating = new AgeRating()
    ageRating.id = dto.ageRatingId

    const game = new Game(dto.name, dto.price, dto.description, new Date(dto.releaseDate), ageRating)
    game.id = dto.id

    for (const genreId of dto.genres) {
      const genre = new Genre()
      genre.id = genreId
      game.addGenre(genre)
    }

    for (const platformId of dto.platforms) {
      const platform = new Platform()
      platform.id = platformId
      game.addPlatform(platform)
    }

    return game
  }
}
