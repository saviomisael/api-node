import { Request, Response } from 'express';
import { ResponseDTO } from '../dto/ResponseDTO';
import { Genre } from '../model/Genre';
import { GenreService } from '../service/GenreService';

export class GenreController {
  private service: GenreService;

  constructor() {
    this.service = new GenreService();
  }

  public async createGenre(req: Request, res: Response) {
    let responseDTO: ResponseDTO<Genre> = {
      data: [],
      errors: ["Genre's name is not defined."],
      success: false,
    };

    if (!req.body.name) return res.status(400).json(responseDTO);

    const genre = await this.service.createGenre(req.body.name);

    if (genre == null) {
      responseDTO = {
        data: [],
        errors: ['This genre already exists.'],
        success: false,
      };

      return res.status(400).json(responseDTO);
    }

    responseDTO = {
      data: [genre],
      success: true,
      errors: [],
    };

    return res.status(200).json(responseDTO);
  }
}
