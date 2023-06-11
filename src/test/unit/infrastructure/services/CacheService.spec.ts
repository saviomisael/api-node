import { type Game } from '$/domain/entities'
import { CacheService } from '$/infrastructure/services/CacheService'
import chai from 'chai'

describe('CacheService', () => {
  it('should replace dynamic keys with corresponding values', () => {
    const cacheService = new CacheService<Game[]>('games:page:sortOrder:sortType')

    const replacements = {
      page: '1',
      sortOrder: 'releaseDate',
      sortType: 'DESC'
    }

    cacheService.replaceKeys(replacements)

    chai.expect(cacheService.getKey()).to.be.equal('games:1:releaseDate:DESC')
  })
})
