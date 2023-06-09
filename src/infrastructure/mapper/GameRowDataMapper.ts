import { AgeRating, Game, Genre, Platform } from '$/domain/entities'
import { type GameRowData } from '../row-data/GameRowData'

export class GameRowDataMapper {
  private constructor () {}

  static toEntity (row: GameRowData): Game {
    const age = new AgeRating(row.age, row.age_rating_description)
    age.id = row.age_rating_id
    const game = new Game(row.game_name, row.game_price, row.game_description, new Date(row.releaseDate), age)
    game.id = row.game_id

    for (let index = 0; index < row.genre_ids.split(',').length; index++) {
      const genreId = row.genre_ids.split(',')[index]
      const genreName = row.genre_names.split(',')[index]
      const genre = new Genre(genreName)
      genre.id = genreId
      game.addGenre(genre)
    }

    for (let index = 0; index < row.platform_ids.split(',').length; index++) {
      const platformId = row.platform_ids.split(',')[index]
      const platformName = row.platform_names.split(',')[index]
      const platform = new Platform(platformName)
      platform.id = platformId
      game.addPlatform(platform)
    }

    return game
  }
}
