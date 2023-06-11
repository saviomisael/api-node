import { type AgeRating, type Game, type Genre, type Platform } from '$/domain/entities'
import { CacheService } from './CacheService'

export class CacheServiceFactory {
  private constructor() {}

  static getGenreCacheService(): CacheService<Genre[]> {
    return new CacheService<Genre[]>('genres')
  }

  static getPlatformCacheService(): CacheService<Platform[]> {
    return new CacheService<Platform[]>('platforms')
  }

  static getAgeRatingCacheService(): CacheService<AgeRating[]> {
    return new CacheService<AgeRating[]>('age-ratings')
  }

  static getGamesCacheService(): CacheService<Game[]> {
    return new CacheService<Game[]>('games:page:sortType:sortOrder')
  }
}
