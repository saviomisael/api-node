import { type Platform } from '$/domain/entities'

export interface IPlatformRepository {
  create: (platform: Platform) => Promise<void>
  getByName: (name: string) => Promise<Platform | null>
  deletePlatform: (platformId: string) => Promise<void>
  getById: (platformId: string) => Promise<Platform | null>
  getAll: () => Promise<Platform[]>
}
