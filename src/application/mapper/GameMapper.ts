import { type Game } from '$/domain/entities'
import { GameResponseDTO } from '../dto/GameResponseDTO'
import { type SingleGameResponseDTO } from '../dto/SingleGameResponseDTO'
import { ReviewMapper } from './ReviewMapper'

export class GameMapper {
  private constructor() {}

  static fromEntityToGameResponse(game: Game): GameResponseDTO {
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

  static fromEntityToSingleGame(game: Game): SingleGameResponseDTO {
    const response = GameMapper.fromEntityToGameResponse(game)

    return {
      ...response,
      reviews: game.getReviews().map((x) => ReviewMapper.fromDomainToReviewResponse(x))
    }
  }
}
