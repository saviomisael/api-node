import { Platform } from '$/domain/entities'
import { type IPlatformRepository } from '$/domain/repositories'
import { type Connection } from 'mysql2/promise'
import { AppDataSource } from '../AppDataSource'
import { DBConnection } from '../DBConnection'

export class PlatformRepository implements IPlatformRepository {
  private connection!: Connection
  private readonly repository = AppDataSource.getRepository(Platform)

  async create(platform: Platform): Promise<void> {
    await this.repository.save(platform)
  }

  async getByName(name: string): Promise<Platform | null> {
    return await this.repository.findOne({
      where: {
        name
      }
    })
  }

  async deletePlatform(id: string): Promise<void> {
    await this.repository.delete({ id })
  }

  async getById(id: string): Promise<Platform | null> {
    return await this.repository.findOne({
      where: {
        id
      }
    })
  }

  async getAll(): Promise<Platform[]> {
    const platforms = await this.repository.find()

    if (platforms === undefined) return []

    return platforms
  }

  async platformIdExists(id: string): Promise<boolean> {
    const platform = await this.repository.findOne({
      where: {
        id
      }
    })

    return platform != null
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
