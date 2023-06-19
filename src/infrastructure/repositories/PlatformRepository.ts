import { Game, Platform } from '$/domain/entities'
import { type IPlatformRepository } from '$/domain/repositories'
import { type Connection } from 'mysql2/promise'
import { AppDataSource } from '../AppDataSource'

export class PlatformRepository implements IPlatformRepository {
  private readonly connection!: Connection
  private readonly platformRepository = AppDataSource.getRepository(Platform)
  private readonly gameRepository = AppDataSource.getRepository(Game)

  async create(platform: Platform): Promise<void> {
    await this.platformRepository.save(platform)
  }

  async getByName(name: string): Promise<Platform | null> {
    return await this.platformRepository.findOne({
      where: {
        name
      }
    })
  }

  async deletePlatform(id: string): Promise<void> {
    await this.platformRepository.delete({ id })
  }

  async getById(id: string): Promise<Platform | null> {
    return await this.platformRepository.findOne({
      where: {
        id
      }
    })
  }

  async getAll(): Promise<Platform[]> {
    const platforms = await this.platformRepository.find()

    if (platforms === undefined) return []

    return platforms
  }

  async platformIdExists(id: string): Promise<boolean> {
    const platform = await this.platformRepository.findOne({
      where: {
        id
      }
    })

    return platform != null
  }

  async hasRelatedGames(id: string): Promise<boolean> {
    const games = await this.gameRepository.find({ where: { platforms: { id } } })

    return games.length > 0
  }
}
