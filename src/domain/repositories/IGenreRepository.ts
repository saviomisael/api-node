import { type Genre } from '$/domain/entities'

export interface IGenreRepository {
  createGenre: (genre: Genre) => Promise<void>
  getGenreById: (id: string) => Promise<Genre | null>
  getGenreByName: (name: string) => Promise<Genre | null>
  getAll: () => Promise<Genre[]>
  deleteGenreById: (id: string) => Promise<void>
}
