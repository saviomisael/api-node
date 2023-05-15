import { PlatformRepository } from '../data/repository/PlatformRepository'
import { Platform } from '../model/Platform'

export class PlatformService {
  private readonly repository = new PlatformRepository()

  async createPlatform (platformName: string): Promise<Platform | null> {
    const isAlreadyCreated = (await this.repository.getByName(platformName)) !=
    null

    if (isAlreadyCreated) return null

    const newPlatform = await this.repository.create(new Platform(platformName))

    return newPlatform
  }
}
