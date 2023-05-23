import { type AgeRating } from '$/domain/entities'
import { type IAgeRatingRepository } from '$/domain/repositories'
import { AgeRatingRepository } from '../repositories'

export class CreateAgeRatingService {
  private readonly repository: IAgeRatingRepository = new AgeRatingRepository()

  async createAgeRating (ageRating: AgeRating): Promise<void> {
    const alreadyExists = await this.repository
      .ageAlreadyExists(ageRating.getAge())

    if (!alreadyExists) await this.repository.create(ageRating)
  }
}
