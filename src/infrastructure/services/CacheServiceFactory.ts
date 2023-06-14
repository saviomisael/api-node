import { type GameResponseDTO } from '$/application/dto/GameResponseDTO'
import { type AgeRating, type Genre, type Platform } from '$/domain/entities'
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

  static getGamesCacheService(): CacheService<GameResponseDTO[]> {
    return new CacheService<GameResponseDTO[]>('games:page:sortType:sortOrder')
  }

  static getGamesSearchCacheService(): CacheService<GameResponseDTO[]> {
    return new CacheService<GameResponseDTO[]>('games:page:sortType:sortOrder:term')
  }
}
