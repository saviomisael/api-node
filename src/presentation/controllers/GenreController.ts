import { GenreService } from '$/application/services/GenreService'
import { type Genre } from '$/domain/entities'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import { type CacheService } from '$/infrastructure/services/CacheService'
import { CacheServiceFactory } from '$/infrastructure/services/CacheServiceFactory'
import { HalWrapper } from '$/presentation/HalWrapper'
import { BaseController } from '$/presentation/controllers/BaseController'
import { CreateGenreDTO, DeleteGenreDTO, type ResponseDTO } from '$/presentation/dto'
import { validate } from 'class-validator'
import { type Request, type Response } from 'express'

export class GenreController extends BaseController {
  private readonly genreService: GenreService = new GenreService()
  private readonly cacheService: CacheService<Genre[]> = CacheServiceFactory.getGenreCacheService()

  async createGenre (req: Request, res: Response): Promise<Response> {
    let responseDTO: ResponseDTO<Genre>

    const createGenreDTO = new CreateGenreDTO(req.body.name)

    const errorsDTO = await validate(createGenreDTO)

    if (errorsDTO.length > 0 && errorsDTO[0].constraints != null) {
      responseDTO = {
        success: false,
        data: [],
        errors: [...Object.values(errorsDTO[0].constraints)]
      }

      return this.badRequest(res, responseDTO)
    }

    const newGenre = await this.genreService.createGenre(createGenreDTO.name)

    if (newGenre == null) {
      responseDTO = {
        data: [],
        errors: ['Esse gênero já existe.'],
        success: false
      }

      return this.badRequest(res, responseDTO)
    }

    const resource = new HalWrapper(newGenre, apiRoutes.genres.create)
      .addLink('GET_list', apiRoutes.genres.getAll)
      .getResource()

    responseDTO = {
      data: [resource],
      success: true,
      errors: []
    }

    return this.created(res, responseDTO)
  }

  async getAllGenres (_: Request, res: Response): Promise<Response> {
    let responseDTO: ResponseDTO<Genre>

    const results = await this.cacheService.getData()

    if (results != null) {
      responseDTO = {
        data: [...results],
        success: true,
        errors: []
      }

      return this.ok(res, responseDTO)
    }

    const genres = await this.genreService.getAllGenres()

    responseDTO = {
      success: true,
      data: [...genres],
      errors: []
    }

    await this.cacheService.setData(genres)

    return this.ok(res, responseDTO)
  }

  async deleteGenre (req: Request, res: Response): Promise<Response> {
    let responseDTO: ResponseDTO<Genre> = {
      data: [],
      success: false,
      errors: []
    }

    const deleteGenreDTO = new DeleteGenreDTO(req.params.id)

    const errors = await validate(deleteGenreDTO)

    if (errors.length > 0 && errors[0].constraints != null) {
      responseDTO = {
        data: [],
        success: false,
        errors: [...Object.values(errors[0].constraints)]
      }

      return this.badRequest(res, responseDTO)
    }

    const result = await this.genreService.deleteGenre(deleteGenreDTO.id)

    if (result) return this.noContent(res)

    responseDTO = {
      data: [],
      success: false,
      errors: ['O gênero não existe.']
    }

    return this.notFound(res, responseDTO)
  }
}
