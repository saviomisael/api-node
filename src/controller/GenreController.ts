import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import { CreateGenreDTO } from '../dto/CreateGenreDTO'
import { DeleteGenreDTO } from '../dto/DeleteGenreDTO'
import { type ResponseDTO } from '../dto/ResponseDTO'
import { type Genre } from '../model/Genre'
import { GenreService } from '../service/GenreService'

export class GenreController {
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

      return res.status(400).json(responseDTO)
    }

    const newGenre = await this.service.createGenre(createGenreDTO.name)

    if (newGenre == null) {
      responseDTO = {
        data: [],
        errors: ['This genre already exists.'],
        success: false
      }

      return res.status(400).json(responseDTO)
    }

    responseDTO = {
      data: [newGenre],
      success: true,
      errors: []
    }

    return res.status(201).json(responseDTO)
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

    return res.status(200).json(responseDTO)
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

      return res.status(400).json(responseDTO)
    }

    const result = await this.service.deleteGenre(deleteGenreDTO.id)

    if (result) return res.status(204).send()

    responseDTO = {
      data: [],
      success: false,
      errors: ['The genre not exists.']
    }

    return res.status(404).json(responseDTO)
  }
}
