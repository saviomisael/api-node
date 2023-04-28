import { Genre } from '../../model/Genre';

export interface IGenreRepository {
  createGenre(genre: Genre): Promise<Genre>;
  getGenreById(id: string): Promise<Genre>;
}
