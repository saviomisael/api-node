import { GenreRepository } from '../data/repository/GenreRepository'
import { Genre } from '../model/Genre'

export class GenreService {
  private readonly repository: GenreRepository = new GenreRepository()

  public async createGenre (genreName: string): Promise<Genre | null> {
    try {
      const isAlreadyCreated =
        (await this.repository.getGenreByName(genreName)) != null

      if (isAlreadyCreated) {
        return null
      }

      const genre = new Genre(genreName)

      const genreRecorded = await this.repository.createGenre(genre)

      return genreRecorded
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
