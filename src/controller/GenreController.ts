import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import { CreateGenreDTO } from '../dto/CreateGenreDTO'
import { type ResponseDTO } from '../dto/ResponseDTO'
import { type Genre } from '../model/Genre'
import { GenreService } from '../service/GenreService'

export class GenreController {
  private readonly service: GenreService = new GenreService()

  public async createGenre (req: Request, res: Response): Promise<Response> {
    try {
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
    } catch (error: any) {
      console.error(error.stack)

      const responseDTO: ResponseDTO<Genre> = {
        data: [],
        success: false,
        errors: ['Internal server error.']
      }

      return res.status(500).json(responseDTO)
    }
  }

  public async getAllGenres (req: Request, res: Response): Promise<Response> {
    let responseDTO: ResponseDTO<Genre> = {
      success: false,
      data: [],
      errors: []
    }

    try {
      const genres = await this.service.getAllGenres()

      responseDTO = {
        success: true,
        data: [...genres],
        errors: []
      }

      return res.status(200).json(responseDTO)
    } catch (error) {
      console.log(error)

      responseDTO = {
        success: false,
        data: [],
        errors: ['Internal server error.']
      }

      return res.status(500).json(responseDTO)
    }
  }
}
