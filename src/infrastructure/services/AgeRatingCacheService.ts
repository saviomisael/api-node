import { type AgeRating } from '$/domain/entities'
import { RedisClient } from '../RedisClient'
import { CacheService } from './CacheService'

export class AgeRatingCacheService extends CacheService<AgeRating[]> {
  key: string = 'age-rating'

  async getData (): Promise<AgeRating[] | null> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    const rawData = await RedisClient.get(this.key)

    if (rawData == null) return null

    return this.deserialize(rawData)
  }

  async setData (data: AgeRating[]): Promise<void> {
    if (!RedisClient.isOpen) await RedisClient.connect()

    await RedisClient.set(this.key, this.serialize(data), { EX: 180 })
  }
}
