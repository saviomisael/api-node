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
      'SELECT * FROM platforms WHERE id = ?',
      [name]
    )

    const [row] = result as any[]

    if (row.length === 0) return null

    const [data] = row[0] as Platform[]

    return data
  }
}
