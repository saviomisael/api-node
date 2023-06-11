import { type Genre } from '$/domain/entities'
import { type IGenreRepository } from '$/domain/repositories'
import { type Connection } from 'mysql2/promise'
import { DBConnection } from '../DBConnection'

export class GenreRepository implements IGenreRepository {
  private connection!: Connection

  async createGenre(genre: Genre): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute('INSERT INTO genres (id, name) VALUES (?, ?)', [genre.id, genre.getName()])
  }

  async getGenreById(id: string): Promise<Genre | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM genres WHERE id = ?', [id])

    const rows = result[0] as Genre[]

    if (rows.length === 0) return null

    const [data] = rows

    return data
  }

  async getGenreByName(name: string): Promise<Genre | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM genres WHERE name = ?', [name])

    const rows = result[0] as Genre[]

    if (rows.length === 0) {
      return null
    }

    const [genre] = rows

    return genre
  }

  async getAll(): Promise<Genre[]> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM genres')

    const data = result[0] as Genre[]

    return data
  }

  async deleteGenreById(id: string): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute('DELETE FROM genres WHERE id = ?', [id])
  }

  async hasRelatedGames(genreId: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT fk_genre FROM games_genres WHERE fk_genre = ?', [genreId])

    const rows = result[0] as any[]

    return rows.length > 0
  }
}
