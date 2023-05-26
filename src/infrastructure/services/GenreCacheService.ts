import { type Genre } from '$/domain/entities'
import { RedisClient } from '../RedisClient'
import { CacheService } from './CacheService'

export class GenreCacheService extends CacheService<Genre[]> {
  protected key = 'genre'
  async getData (): Promise<Genre[] | null> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    const results = await RedisClient.get(this.key)

    if (results == null) return null

    return this.deserialize(results)
  }

  async setData (data: Genre[]): Promise<void> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    await RedisClient.set(this.key, this.serialize(data), { EX: 180 })
  }
}
