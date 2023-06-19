import { Genre } from '$/domain/entities'
import { type IGenreRepository } from '$/domain/repositories'
import { type Connection } from 'mysql2/promise'
import { AppDataSource } from '../AppDataSource'
import { DBConnection } from '../DBConnection'

export class GenreRepository implements IGenreRepository {
  private connection!: Connection
  private readonly repository = AppDataSource.getRepository(Genre)

  async createGenre(genre: Genre): Promise<void> {
    await this.repository.save(genre)
  }

  async getGenreById(id: string): Promise<Genre | null> {
    const genre = await this.repository.findOne({
      where: {
        id
      }
    })

    return genre
  }

  async getGenreByName(name: string): Promise<Genre | null> {
    return await this.repository.findOne({
      where: {
        name
      }
    })
  }

  async getAll(): Promise<Genre[]> {
    const genres = await this.repository.find()

    if (genres === undefined) return []

    return genres
  }

  async deleteGenreById(id: string): Promise<void> {
    await this.repository.delete({ id })
  }

  async hasRelatedGames(genreId: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT fk_genre FROM games_genres WHERE fk_genre = ?', [genreId])

    const rows = result[0] as any[]

    return rows.length > 0
  }
}
