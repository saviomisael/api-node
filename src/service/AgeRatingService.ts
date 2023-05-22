import { AgeRatingRepository } from '$/data/repository'
import { type AgeRating } from '$/domain/entities'
import { type IAgeRatingRepository } from '$/domain/repositories'

export class AgeRatingService {
  private readonly repository: IAgeRatingRepository = new AgeRatingRepository()

  async createAgeRating (ageRating: AgeRating): Promise<void> {
    const alreadyExists = await this.repository
      .ageAlreadyExists(ageRating.getAge())

    if (!alreadyExists) await this.repository.create(ageRating)
  }

  async getAllAgeRatings (): Promise<AgeRating[]> {
    const ageRatings = await this.repository.getAll()

    return ageRatings
  }
}
