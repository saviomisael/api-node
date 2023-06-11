import { type Platform } from '$/domain/entities'
import { type IPlatformRepository } from '$/domain/repositories'
import { type Connection } from 'mysql2/promise'
import { DBConnection } from '../DBConnection'

export class PlatformRepository implements IPlatformRepository {
  private connection!: Connection

  async create(platform: Platform): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute('INSERT INTO platforms (id, name) VALUES (?, ?)', [platform.id, platform.getName()])
  }

  async getByName(name: string): Promise<Platform | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM platforms WHERE name = ?', [name])

    const rows = result[0] as Platform[]

    if (rows.length === 0) return null

    const [data] = rows

    return data
  }

  async deletePlatform(platformId: string): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute('DELETE FROM platforms WHERE id = ?', [platformId])
  }

  async getById(id: string): Promise<Platform | null> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM platforms WHERE id = ?', [id])

    const rows = result[0] as Platform[]

    const exists = rows.length > 0

    if (!exists) return null

    const [data] = rows

    return data
  }

  async getAll(): Promise<Platform[]> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM platforms')

    const platforms = result[0] as Platform[]

    return platforms
  }

  async platformIdExists(platformId: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT id FROM platforms WHERE id = ?', [platformId])

    const rows = result[0] as any[]

    return rows.length > 0
  }

  async hasRelatedGames(platformId: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT fk_platform FROM games_platforms WHERE fk_platform = ?', [
      platformId
    ])

    const rows = result[0] as any[]

    return rows.length > 0
  }
}
