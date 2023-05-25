import { ListAgeRatingService } from '$/application/services/ListAgeRatingService'
import { type AgeRating } from '$/domain/entities'
import { AgeRatingCacheService } from '$/infrastructure/services/AgeRatingCacheService'
import { type CacheService } from '$/infrastructure/services/CacheService'
import { BaseController } from '$/presentation/controllers/BaseController'
import { type ResponseDTO } from '$/presentation/dto'
import { type Request, type Response } from 'express'

export class AgeRatingController extends BaseController {
  private readonly listService = new ListAgeRatingService()
  private readonly cacheService: CacheService<AgeRating[]> = new AgeRatingCacheService()

  async getAll (_: Request, res: Response): Promise<Response> {
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
