import { AgeNotExistsError } from '$/application/errors/AgeNotExistsError'
import { GenreNotExistsError } from '$/application/errors/GenreNotExistsError'
import { PlatformNotExistsError } from '$/application/errors/PlatformNotExistsError'
import { GameService } from '$/application/services/GameService'
import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import { type ResponseDTO } from '../dto'
import { CreateGameDTO } from '../dto/CreateGameDTO'
import { type GameResponseDTO } from '../dto/GameResponseDTO'
import { GetGameDTO } from '../dto/GetGameDTO'
import { GameMapper } from '../mapper/GameMapper'
import { BaseController } from './BaseController'

export class GameController extends BaseController {
  private readonly gameService: GameService = new GameService()

  async createGame (req: Request, res: Response): Promise<Response> {
    let response: ResponseDTO<GameResponseDTO>
    const containsGenresDuplicates = req.body.genres.length !== [...new Set([...req.body.genres])].length

    if (containsGenresDuplicates) {
      response = {
        data: [],
        success: false,
        errors: ['Você enviou gêneros duplicados.']
      }
      return this.badRequest(res, response)
    }

    const containsPlatformsDuplicates = req.body.platforms.length !== [...new Set([...req.body.platforms])].length

    if (containsPlatformsDuplicates) {
      response = {
        data: [],
        success: false,
        errors: ['Você enviou plataformas duplicadas.']
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

    try {
      const newGame = await this.gameService.createGame(GameMapper.toEntity(dto))

      if (newGame == null) {
        response = {
          data: [],
          success: false,
          errors: ['Erro ao retornar o jogo criado.']
        }

        return this.internalServerError(res, response)
      }

      response = {
        data: [GameMapper.fromEntityToGameResponse(newGame)],
        success: true,
        errors: []
      }

      return this.created(res, response)
    } catch (error) {
      if (error instanceof AgeNotExistsError ||
        error instanceof PlatformNotExistsError ||
        error instanceof GenreNotExistsError) {
        response = {
          data: [],
          success: false,
          errors: [error.message]
        }

        return this.notFound(res, response)
      }

      throw error
    }
  }

  async getGameById (req: Request, res: Response): Promise<Response> {
    const dto = new GetGameDTO()
    dto.id = req.params.id
    let response: ResponseDTO<GameResponseDTO>

    const errors = await validate(dto)

    if (errors.length > 0) {
      response = {
        data: [],
        success: false,
        errors: [...errors.flatMap(x => Object.values(x.constraints as Record<string, string>))]
      }

      return this.badRequest(res, response)
    }

    const game = await this.gameService.getGameById(dto.id)

    if (game == null) {
      response = {
        data: [],
        success: false,
        errors: ['Jogo não encontrado.']
      }

      return this.notFound(res, response)
    }

    response = {
      data: [GameMapper.fromEntityToGameResponse(game)],
      success: true,
      errors: []
    }

    return this.ok(res, response)
  }
}
