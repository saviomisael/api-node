import { type Connection } from 'mysql2/promise'
import { type Platform } from '../../model/Platform'
import { DBConnection } from '../DBConnection'
import { type IPlatformRepository } from './IPlatformRepository'

export class PlatformRepository implements IPlatformRepository {
  private connection!: Connection

  async create (platform: Platform): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute(
      'INSERT INTO platforms (id, name) VALUES (?, ?)',
      [platform.getId(), platform.getName()]
    )
  }

  async getByName (name: string): Promise<Platform | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      'SELECT * FROM platforms WHERE name = ?',
      [name]
    )

    const rows = result[0] as Platform[]

    if (rows.length === 0) return null

    const [data] = rows

    return data
  }

  async deletePlatform (platformId: string): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute(
      'DELETE FROM platforms WHERE id = ?',
      [platformId]
    )
  }

  async getById (id: string): Promise<Platform | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      'SELECT * FROM platforms WHERE id = ?',
      [id]
    )

    const rows = result[0] as Platform[]

    const exists = rows.length > 0

    if (!exists) return null

    const [data] = rows

    return data
  }

  async getAll (): Promise<Platform[]> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM platforms')

    const platforms = result[0] as Platform[]

    return platforms
  }
}
