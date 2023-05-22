import { AgeRatingService } from '$/application/services/AgeRatingService'
import { type AgeRating } from '$/domain/entities'
import { type Request, type Response } from 'express'
import { type ResponseDTO } from '../dto'
import { BaseController } from './BaseController'

export class AgeRatingController extends BaseController {
  private readonly service = new AgeRatingService()

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
