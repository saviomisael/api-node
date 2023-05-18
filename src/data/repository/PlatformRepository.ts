import { type Connection } from 'mysql2/promise'
import { type Platform } from '../../model/Platform'
import { DBConnection } from '../DBConnection'
import { type IPlatformRepository } from './IPlatformRepository'

export class PlatformRepository implements IPlatformRepository {
  private connection!: Connection

  async create (platform: Platform): Promise<Platform | null> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute(
      'INSERT INTO platforms (id, name) VALUES (?, ?)',
      [platform.getId(), platform.getName()]
    )

    const newPlatform = await this.getByName(platform.getName())

    return newPlatform
  }

  async getByName (name: string): Promise<Platform | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      'SELECT * FROM platforms WHERE name = ?',
      [name]
    )

    const row = result[0] as Platform[]

    if (row.length === 0) return null

    const [data] = row

    return data
  }

  async deletePlatform (platformId: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      'DELETE FROM platforms WHERE id = ?',
      [platformId]
    )

    const data = result[0] as Platform[]

    return data.length > 0
  }

  async getById (id: string): Promise<Platform | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      'SELECT * FROM platforms WHERE id = ?',
      [id]
    )

    const [row] = result as any[]

    const exists = row.length > 0

    if (!exists) return null

    const [data] = row as Platform[]

    return data
  }

  async getAll (): Promise<Platform[]> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM platforms')

    const platforms = result[0] as Platform[]

    return platforms
  }
}
