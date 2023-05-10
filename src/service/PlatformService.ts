import { PlatformRepository } from '../data/repository/PlatformRepository'
import { type Platform } from '../model/Platform'

export class PlatformService {
  private readonly repository = new PlatformRepository()

  async createPlatform (platformName: string): Promise<Platform | null> {
    const alreadyExists = await this.repository.getByName(platformName)

    if (alreadyExists != null) return null

    const newPlatform = await this.createPlatform(platformName)

    return newPlatform
  }
}
