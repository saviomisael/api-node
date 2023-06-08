import { GameService } from '$/application/services/GameService'
import { type Game } from '$/domain/entities'
import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import { type ResponseDTO } from '../dto'
import { CreateGameDTO } from '../dto/CreateGameDTO'
import { BaseController } from './BaseController'

export class GameController extends BaseController {
  private readonly gameService: GameService = new GameService()

  async createGame (req: Request, res: Response): Promise<Response> {
    let response: ResponseDTO<Game>
    const containsGenresDuplicates = req.body.genres.length !== [...new Set([...req.body.genres])].length

    if (containsGenresDuplicates) {
      response = {
        data: [],
        success: false,
        errors: ['Você enviou gêneros duplicados']
      }
      return this.badRequest(res, response)
    }

    const containsPlatformsDuplicates = req.body.platforms.length !== [...new Set([...req.body.platforms])].length

    if (containsPlatformsDuplicates) {
      response = {
        data: [],
        success: false,
        errors: ['Você enviou plataformas duplicadas']
      }

      return this.badRequest(res, response)
    }

    const dto = new CreateGameDTO()
    dto.name = req.body.name
    dto.price = req.body.price
    dto.description = req.body.description
    dto.releaseDate = req.body.releaseDate
    dto.ageRatingId = req.body.ageRatingId
    dto.platforms = req.body.platforms
    dto.genres = req.body.genres

    const errors = await validate(dto)

    if (errors.length > 0) {
      const errorsMessages = errors.flatMap(x => Object.values(x.constraints as Record<string, string>))

      response = {
        data: [],
        success: false,
        errors: [...errorsMessages]
      }

      return this.badRequest(res, response)
    }

    return this.created(res, { ok: true })
  }
}
