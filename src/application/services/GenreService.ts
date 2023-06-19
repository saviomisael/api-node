import { Genre } from '$/domain/entities'
import { type IGenreRepository } from '$/domain/repositories'
import { HasRelatedGamesError } from '../errors/HasRelatedGamesError'

export class GenreService {
  constructor(private readonly repository: IGenreRepository) {}

  async createGenre(genreName: string): Promise<Genre | null> {
    const isAlreadyCreated = (await this.repository.getGenreByName(genreName)) != null

    if (isAlreadyCreated) {
      return null
    }

    const genre = new Genre()
    genre.name = genreName

    await this.repository.createGenre(genre)

    const genreRecorded = await this.repository.getGenreById(genre.id)

    return genreRecorded
  }

  async getAllGenres(): Promise<Genre[]> {
    const genres = await this.repository.getAll()

    return genres
  }

  async deleteGenre(id: string): Promise<boolean> {
    const genreToDelete = await this.repository.getGenreById(id)

    if (genreToDelete == null) return false

    const hasRelatedGames = await this.repository.hasRelatedGames(id)

    if (hasRelatedGames) {
      throw new HasRelatedGamesError(id)
    }

    await this.repository.deleteGenreById(id)

    return true
  }
}
