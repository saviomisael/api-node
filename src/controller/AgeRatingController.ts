import { type Request, type Response } from 'express'
import { AgeRatingService } from '../service/AgeRatingService'
import { BaseController } from './BaseController'

export class AgeRatingController extends BaseController {
  private readonly service = new AgeRatingService()

  async getAll (req: Request, res: Response): Promise<Response> {
    const ageRatings = await this.service.getAllAgeRatings()

    return this.ok(res, ageRatings)
  }
}
