import { type Genre } from '../../model/Genre'

export interface IGenreRepository {
  createGenre: (genre: Genre) => Promise<Genre | null>
  getGenreById: (id: string) => Promise<Genre | null>
  getGenreByName: (name: string) => Promise<Genre | null>
  getAll: () => Promise<Genre[]>
  deleteGenreById: (id: string) => Promise<boolean>
}
