import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import hal from 'hal'
import { CreateGenreDTO, DeleteGenreDTO, type ResponseDTO } from '../dto'
import { type Genre } from '../model/Genre'
import { apiRoutes } from '../routes/apiRoutes'
import { GenreService } from '../service/GenreService'
import { BaseController } from './BaseController'

export class GenreController extends BaseController {
  private readonly service: GenreService = new GenreService()

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

    const newGenre = await this.service.createGenre(createGenreDTO.name)

    if (newGenre == null) {
      responseDTO = {
        data: [],
        errors: ['This genre already exists.'],
        success: false
      }

      return this.badRequest(res, responseDTO)
    }

    const resource = hal.Resource(newGenre, apiRoutes.genres.create)
    resource.link(new hal.Link('GET list', apiRoutes.genres.getAll))

    responseDTO = {
      data: [resource.toJSON()],
      success: true,
      errors: []
    }

    return this.created(res, responseDTO)
  }

  async getAllGenres (_: Request, res: Response): Promise<Response> {
    let responseDTO: ResponseDTO<Genre> = {
      success: false,
      data: [],
      errors: []
    }

    const genres = await this.service.getAllGenres()

    responseDTO = {
      success: true,
      data: [...genres],
      errors: []
    }

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

    const result = await this.service.deleteGenre(deleteGenreDTO.id)

    if (result) return this.noContent(res)

    responseDTO = {
      data: [],
      success: false,
      errors: ['The genre not exists.']
    }

    return this.notFound(res, responseDTO)
  }
}
