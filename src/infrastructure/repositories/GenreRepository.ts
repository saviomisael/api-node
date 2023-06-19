import { Game, Genre } from '$/domain/entities'
import { type IGenreRepository } from '$/domain/repositories'
import { type Connection } from 'mysql2/promise'
import { AppDataSource } from '../AppDataSource'

export class GenreRepository implements IGenreRepository {
  private readonly connection!: Connection
  private readonly genreRepository = AppDataSource.getRepository(Genre)
  private readonly gameRepository = AppDataSource.getRepository(Game)

  async createGenre(genre: Genre): Promise<void> {
    await this.genreRepository.save(genre)
  }

  async getGenreById(id: string): Promise<Genre | null> {
    const genre = await this.genreRepository.findOne({
      where: {
        id
      }
    })

    return genre
  }

  async getGenreByName(name: string): Promise<Genre | null> {
    return await this.genreRepository.findOne({
      where: {
        name
      }
    })
  }

  async getAll(): Promise<Genre[]> {
    const genres = await this.genreRepository.find()

    if (genres === undefined) return []

    return genres
  }

  async deleteGenreById(id: string): Promise<void> {
    await this.genreRepository.delete({ id })
  }

  async hasRelatedGames(id: string): Promise<boolean> {
    const games = await this.gameRepository.find({ where: { genres: { id } } })

    return games.length > 0
  }
}
