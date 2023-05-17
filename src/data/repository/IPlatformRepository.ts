import { type Platform } from '../../model/Platform'

export interface IPlatformRepository {
  create: (platform: Platform) => Promise<Platform | null>
  getByName: (name: string) => Promise<Platform | null>
  deletePlatform: (platformId: string) => Promise<boolean>
  getById: (platformId: string) => Promise<Platform | null>
}
