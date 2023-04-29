import { type Request, type Response } from 'express'
import { type ResponseDTO } from '../dto/ResponseDTO'
import { type Genre } from '../model/Genre'
import { GenreService } from '../service/GenreService'

export class GenreController {
  private readonly service: GenreService = new GenreService()

  public async createGenre (req: Request, res: Response): Promise<Response> {
    try {
      let responseDTO: ResponseDTO<Genre> = {
        data: [],
        errors: ["Genre's name is not defined."],
        success: false
      }

      if (req.body.name === undefined) return res.status(400).json(responseDTO)

      if (req.body.name.length < 1) {
        responseDTO = {
          data: [],
          errors: ["Genre's name is empty."],
          success: false
        }

        return res.status(400).json(responseDTO)
      }

      const genre = await this.service.createGenre(req.body.name)

      if (genre == null) {
        responseDTO = {
          data: [],
          errors: ['This genre already exists.'],
          success: false
        }

        return res.status(400).json(responseDTO)
      }

      responseDTO = {
        data: [genre],
        success: true,
        errors: []
      }

      return res.status(200).json(responseDTO)
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
}
