import { ListAgeRatingService } from '$/application/services/ListAgeRatingService'
import { type AgeRating } from '$/domain/entities'
import { BaseController } from '$/presentation/controllers/BaseController'
import { type ResponseDTO } from '$/presentation/dto'
import { type Request, type Response } from 'express'

export class AgeRatingController extends BaseController {
  private readonly service = new ListAgeRatingService()

  async getAll (_: Request, res: Response): Promise<Response> {
    const ageRatings = await this.service.getAllAgeRatings()

    const response: ResponseDTO<AgeRating> = {
      data: [...ageRatings],
      success: true,
      errors: []
    }

    return this.ok(res, response)
  }
}
