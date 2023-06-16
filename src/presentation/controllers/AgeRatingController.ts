import { ListAgeRatingService } from '$/application/services/ListAgeRatingService'
import { type AgeRating } from '$/domain/entities'
import { type CacheService } from '$/infrastructure/services/CacheService'
import { CacheServiceFactory } from '$/infrastructure/services/CacheServiceFactory'
import { type ResponseDTO } from '$/presentation/dto'
import { type Request, type Response } from 'express'
import { HttpHandler } from '../HttpHandler'

export class AgeRatingController extends HttpHandler {
  private readonly listService = new ListAgeRatingService()
  private readonly cacheService: CacheService<AgeRating[]> = CacheServiceFactory.getAgeRatingCacheService()

  async getAll(_: Request, res: Response): Promise<Response> {
    const results = await this.cacheService.getData()
    let response: ResponseDTO<AgeRating>

    if (results != null) {
      response = {
        data: [...results],
        success: true,
        errors: []
      }

      return this.ok(res, response)
    }

    const ageRatings = await this.listService.getAllAgeRatings()

    response = {
      data: [...ageRatings],
      success: true,
      errors: []
    }

    await this.cacheService.setData(ageRatings)

    return this.ok(res, response)
  }
}
