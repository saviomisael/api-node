import { Platform } from '$/domain/entities'
import { type IPlatformRepository } from '$/domain/repositories'
import { PlatformRepository } from '$/infrastructure/repositories'
import { HasRelatedGamesError } from '../errors'

export class PlatformService {
  private readonly repository: IPlatformRepository = new PlatformRepository()

  async createPlatform(platformName: string): Promise<Platform | null> {
    const isAlreadyCreated = (await this.repository.getByName(platformName)) != null

    if (isAlreadyCreated) return null

    const platform = new Platform()
    platform.name = platformName

    await this.repository.create(platform)

    const newPlatform = await this.repository.getByName(platformName)

    return newPlatform
  }

  async deletePlatformById(platformId: string): Promise<boolean> {
    const platformAlreadyExists = await this.repository.getById(platformId)

    if (platformAlreadyExists == null) return false

    const hasRelatedGames = await this.repository.hasRelatedGames(platformId)

    if (hasRelatedGames) {
      throw new HasRelatedGamesError(platformId)
    }

    await this.repository.deletePlatform(platformId)

    return true
  }

  async getAllPlatforms(): Promise<Platform[]> {
    const platforms = await this.repository.getAll()

    return platforms
  }
}
