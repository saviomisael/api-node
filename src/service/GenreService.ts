import { GenreRepository } from '../data/repository/GenreRepository'
import { Genre } from '../model/Genre'

export class GenreService {
  private readonly repository: GenreRepository = new GenreRepository()

  async createGenre (genreName: string): Promise<Genre | null> {
    const isAlreadyCreated =
        (await this.repository.getGenreByName(genreName)) != null

    if (isAlreadyCreated) {
      return null
    }

    const genre = new Genre(genreName)

    const genreRecorded = await this.repository.createGenre(genre)

    return genreRecorded
  }

  async getAllGenres (): Promise<Genre[]> {
    const genres = await this.repository.getAll()

    return genres
  }

  async deleteGenre (id: string): Promise<boolean> {
    const genreToDelete = await this.repository.getGenreById(id)

    if (genreToDelete == null) return false

    await this.repository.deleteGenreById(id)

    return true
  }
}
