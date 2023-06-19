import { type Game } from '$/domain/entities'
import { GameResponseDTO } from '../dto/GameResponseDTO'
import { type SingleGameResponseDTO } from '../dto/SingleGameResponseDTO'
import { ReviewMapper } from './ReviewMapper'

export class GameMapper {
  private constructor() {}

  static fromEntityToGameResponse(game: Game): GameResponseDTO {
    const gameDTO = new GameResponseDTO()
    gameDTO.id = game.id
    gameDTO.ageRating = game.ageRating
    gameDTO.description = game.description
    gameDTO.genres = game.genres
    gameDTO.name = game.name
    gameDTO.platforms = game.platforms
    gameDTO.price = game.price
    gameDTO.releaseDate = game.releaseDate.toISOString()

    return gameDTO
  }

  static fromEntityToSingleGame(game: Game): SingleGameResponseDTO {
    const response = GameMapper.fromEntityToGameResponse(game)

    return {
      ...response,
      reviews: game.reviews.map((x) => ReviewMapper.fromDomainToReviewResponse(x))
    }
  }
}
