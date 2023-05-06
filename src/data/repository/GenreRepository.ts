import { type Connection } from 'mysql2/promise'
import { type Genre } from '../../model/Genre'
import { DBConnection } from '../DBConnection'
import { type IGenreRepository } from './IGenreRepository'

export class GenreRepository implements IGenreRepository {
  private connection!: Connection

  async createGenre (genre: Genre): Promise<Genre | null> {
    try {
      this.connection = await DBConnection.getConnection()

      await this.connection.execute(
        'INSERT INTO genres (id, name) VALUES (?, ?)',
        [genre.getId(), genre.getName()]
      )

      const newGenre = await this.getGenreById(genre.getId())

      return newGenre
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async getGenreById (id: string): Promise<Genre | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      'SELECT * FROM genres WHERE id = ?',
      [id]
    )

    const [row] = result as any[]

    if (row.length === 0) return null

    const [data] = row as Genre[]

    return data
  }

  async getGenreByName (name: string): Promise<Genre | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      'SELECT * FROM genres WHERE name = ?',
      [name]
    )

    const row = result[0] as Genre[]

    if (row.length === 0) {
      return null
    }

    const [genre] = row

    return genre
  }

  async getAll (): Promise<Genre[]> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM genres')

    const data = result[0] as Genre[]

    return data
  }

  async deleteGenreById (id: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('DELETE FROM genres WHERE id = ?', [id])

    const data = result[0] as any[]

    return data.length > 0
  }
}
