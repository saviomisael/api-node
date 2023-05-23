import { type AgeRating } from '$/domain/entities'
import { type IAgeRatingRepository } from '$/domain/repositories'
import { AgeRatingRepository } from '$/infrastructure/repositories'

export class ListAgeRatingService {
  private readonly repository: IAgeRatingRepository = new AgeRatingRepository()

  async getAllAgeRatings (): Promise<AgeRating[]> {
    const ageRatings = await this.repository.getAll()

    return ageRatings
  }
}
