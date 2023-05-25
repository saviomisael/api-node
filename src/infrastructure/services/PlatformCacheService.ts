import { type Platform } from '$/domain/entities'
import { RedisClient } from '../RedisClient'
import { CacheService } from './CacheService'

export class PlatformCacheService extends CacheService<Platform[]> {
  protected key: string = 'platform'
  async getData (): Promise<Platform[] | null> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    const results = await RedisClient.get(this.key)

    if (results == null) return null

    return this.deserialize(results)
  }

  async setData (data: Platform[]): Promise<void> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    await RedisClient.set(this.key, this.serialize(data), { EX: 180 })
  }
}
