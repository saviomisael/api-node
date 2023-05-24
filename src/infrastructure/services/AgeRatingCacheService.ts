import { type AgeRating } from '$/domain/entities'
import RedisClient from '../RedisClient'
import { CacheService } from './CacheService'

export class AgeRatingCacheService extends CacheService<AgeRating[]> {
  key: string = 'age-rating'

  async getData (): Promise<AgeRating[] | null> {
    const rawData = await RedisClient.get(this.key)

    if (rawData == null) return null

    return this.deserialize(rawData)
  }

  async setData (data: AgeRating[]): Promise<void> {
    await RedisClient.set(this.key, this.serialize(data))
  }
}
