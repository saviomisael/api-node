import { type GameResponseDTO } from '$/application/dto/GameResponseDTO'
import { AgeNotExistsError, GenreNotExistsError, PlatformNotExistsError } from '$/application/errors'
import { GameMapper as GameMapperApp } from '$/application/mapper/GameMapper'
import { GameService } from '$/application/services/GameService'
import { type IGameRepository } from '$/domain/repositories'
import { GameNotExistsError } from '$/infrastructure/errors/GameNotExistsError'
import { GameRepository } from '$/infrastructure/repositories/GameRepository'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import { HalWrapper } from '../HalWrapper'
import { HttpHandler } from '../HttpHandler'
import { minPages } from '../constants'
import {
  CreateGameDTO,
  DeleteGameDTO,
  GamesQueryStringDTO,
  GetGameDTO,
  UpdateGameDTO,
  type GamesGetAllResponseDTO,
  type ResponseDTO
} from '../dto'
import { GameMapper } from '../mapper/GameMapper'

export class GameController extends HttpHandler {
  private readonly gameService: GameService = new GameService()
  private readonly gameRepository: IGameRepository = new GameRepository()

  async createGame(req: Request, res: Response): Promise<Response> {
    let response: ResponseDTO<GameResponseDTO>
    const containsGenresDuplicates = req.body.genres.length !== [...new Set([...(req.body.genres as string[])])].length

    if (containsGenresDuplicates) {
      response = {
        data: [],
        success: false,
        errors: ['Você enviou gêneros duplicados.']
      }
      return this.badRequest(res, response)
    }

    const containsPlatformsDuplicates =
      req.body.platforms.length !== [...new Set([...(req.body.platforms as string[])])].length

    if (containsPlatformsDuplicates) {
      response = {
        data: [],
        success: false,
        errors: ['Você enviou plataformas duplicadas.']
      }

      return this.badRequest(res, response)
    }

    const dto = new CreateGameDTO()
    dto.name = req.body.name as string
    dto.price = req.body.price as number
    dto.description = req.body.description as string
    dto.releaseDate = req.body.releaseDate as string
    dto.ageRatingId = req.body.ageRatingId as string
    dto.platforms = req.body.platforms as string[]
    dto.genres = req.body.genres as string[]

    const errors = await validate(dto)

    if (errors.length > 0) {
      const errorsMessages = errors.flatMap((x) => Object.values(x.constraints as Record<string, string>))

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

      const resource = new HalWrapper(
        GameMapperApp.fromEntityToGameResponse(newGame),
        apiRoutes.games.getById.replace(':id', newGame.id)
      )
        .addLink('PUT_update_game', apiRoutes.games.updateGameById.replace(':id', newGame.id))
        .addLink('DELETE_delete_game', apiRoutes.games.deleteById.replace(':id', newGame.id))
        .getResource()

      response = {
        data: [resource],
        success: true,
        errors: []
      }

      return this.created(res, response)
    } catch (error) {
      if (
        error instanceof AgeNotExistsError ||
        error instanceof PlatformNotExistsError ||
        error instanceof GenreNotExistsError
      ) {
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

  async getGameById(req: Request, res: Response): Promise<Response> {
    const dto = new GetGameDTO()
    dto.id = req.params.id
    let response: ResponseDTO<GameResponseDTO>

    const errors = await validate(dto)

    if (errors.length > 0) {
      response = {
        data: [],
        success: false,
        errors: [...errors.flatMap((x) => Object.values(x.constraints as Record<string, string>))]
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

    const resource = new HalWrapper(
      GameMapperApp.fromEntityToGameResponse(game),
      apiRoutes.games.getById.replace(':id', game.id)
    )
      .addLink('PUT_update_game', apiRoutes.games.updateGameById.replace(':id', game.id))
      .addLink('DELETE_delete_game', apiRoutes.games.deleteById.replace(':id', game.id))
      .getResource()

    response = {
      data: [resource],
      success: true,
      errors: []
    }

    return this.ok(res, response)
  }

  async updateGameById(req: Request, res: Response): Promise<Response> {
    let response: ResponseDTO<GameResponseDTO>

    const oldGame = await this.gameRepository.getById(req.params.id)

    if (oldGame == null) {
      response = {
        data: [],
        success: false,
        errors: ['O jogo não existe.']
      }

      return this.notFound(res, response)
    }

    const containsGenresDuplicates = req.body.genres.length !== [...new Set([...(req.body.genres as string[])])].length

    if (containsGenresDuplicates) {
      response = {
        data: [],
        success: false,
        errors: ['Você enviou gêneros duplicados.']
      }
      return this.badRequest(res, response)
    }

    const containsPlatformsDuplicates =
      req.body.platforms.length !== [...new Set([...(req.body.platforms as string[])])].length

    if (containsPlatformsDuplicates) {
      response = {
        data: [],
        success: false,
        errors: ['Você enviou plataformas duplicadas.']
      }
      return this.badRequest(res, response)
    }

    const dto = new UpdateGameDTO()
    dto.id = req.params.id
    dto.ageRatingId = req.body.ageRatingId
    dto.description = req.body.description
    dto.genres = req.body.genres
    dto.name = req.body.name
    dto.platforms = req.body.platforms
    dto.price = req.body.price
    dto.releaseDate = req.body.releaseDate

    const errors = await validate(dto)

    if (errors.length > 0) {
      response = {
        data: [],
        success: false,
        errors: errors.flatMap((x) => Object.values(x.constraints as Record<string, string>))
      }

      return this.badRequest(res, response)
    }

    try {
      const updatedGame = await this.gameService.updateGameById(GameMapper.fromUpdateGameDtoToEntity(dto))

      if (updatedGame == null) {
        response = {
          data: [],
          success: false,
          errors: ['Erro ao retornar o jogo atualizado.']
        }

        return this.internalServerError(res, response)
      }

      const resource = new HalWrapper(
        GameMapperApp.fromEntityToGameResponse(updatedGame),
        apiRoutes.games.getById.replace(':id', updatedGame.id)
      )
        .addLink('PUT_update_game', apiRoutes.games.updateGameById.replace(':id', updatedGame.id))
        .addLink('DELETE_delete_game', apiRoutes.games.deleteById.replace(':id', updatedGame.id))
        .getResource()

      response = {
        data: [resource],
        success: true,
        errors: []
      }

      return this.ok(res, response)
    } catch (error) {
      if (
        error instanceof AgeNotExistsError ||
        error instanceof PlatformNotExistsError ||
        error instanceof GenreNotExistsError
      ) {
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

  async deleteGameById(req: Request, res: Response): Promise<Response> {
    let response: ResponseDTO<GameResponseDTO>

    const dto = new DeleteGameDTO()
    dto.id = req.params.id

    const errors = await validate(dto)

    if (errors.length > 0) {
      response = {
        data: [],
        success: false,
        errors: errors.flatMap((x) => Object.values(x.constraints as Record<string, string>))
      }

      return this.badRequest(res, response)
    }

    try {
      await this.gameService.deleteGameById(dto.id)

      return this.noContent(res)
    } catch (error) {
      if (error instanceof GameNotExistsError) {
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

  async getAll(req: Request, res: Response): Promise<Response> {
    const dto = new GamesQueryStringDTO(
      req.query.page as string | undefined,
      req.query.sort as string | undefined,
      req.query.term as string | undefined
    )

    const maxPages: number =
      dto.getTerm().length > 0
        ? await this.gameRepository.getMaxPagesBySearch(dto.getTerm())
        : await this.gameRepository.getMaxPages()

    if (dto.getPage() > maxPages) {
      dto.setPage(minPages)
    }

    let games: GameResponseDTO[] =
      dto.getTerm().length > 0
        ? await this.gameService.searchByTerm(dto.getTerm(), dto.getPage(), dto.getSortType(), dto.getSortOrder())
        : await this.gameService.getAll(dto.getPage(), dto.getSortType(), dto.getSortOrder())

    games = games.map((x) => {
      return new HalWrapper(x, apiRoutes.games.getById.replace(':id', x.id))
        .addLink('PUT_update_game', apiRoutes.games.updateGameById.replace(':id', x.id))
        .addLink('DELETE_delete_game', apiRoutes.games.deleteById.replace(':id', x.id))
        .getResource()
    })

    const gamesResponse: GamesGetAllResponseDTO = {
      games,
      currentPage: dto.getPage(),
      lastPage: maxPages,
      nextPage: dto.getPage() < maxPages ? dto.getPage() + 1 : null,
      previousPage: dto.getPage() > minPages ? dto.getPage() - 1 : null
    }

    const response = {
      data: [gamesResponse],
      errors: [],
      success: true
    }

    return this.ok(res, response)
  }
}
