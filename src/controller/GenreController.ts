import { Request, Response } from 'express';
import { ResponseDTO } from '../dto/ResponseDTO';
import { Genre } from '../model/Genre';
import { GenreService } from '../service/GenreService';

export class GenreController {
  public async createGenre(req: Request, res: Response) {
    try {
      let responseDTO: ResponseDTO<Genre> = {
        data: [],
        errors: ["Genre's name is not defined."],
        success: false,
      };

      if (!req.body.name) return res.status(400).json(responseDTO);

      const service = new GenreService();

      const genre = await service.createGenre(req.body.name);

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
    } catch (error: any) {
      console.error(error.stack);

      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}
