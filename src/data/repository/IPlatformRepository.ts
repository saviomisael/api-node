import { type Platform } from '../../model/Platform'

export interface IPlatformRepository {
  create: (platform: Platform) => Promise<Platform>
  getByName: (name: string) => Promise<Platform>
}
