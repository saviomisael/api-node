import { AgeRating } from '$/domain/entities'
import { type IAgeRatingRepository } from '$/domain/repositories/IAgeRatingRepository'
import { AppDataSource } from '../AppDataSource'

export class AgeRatingRepository implements IAgeRatingRepository {
  private readonly repository = AppDataSource.getRepository(AgeRating)

  async create(ageRating: AgeRating): Promise<void> {
    await this.repository.save(ageRating)
  }

  async ageAlreadyExists(age: string): Promise<boolean> {
    const ageFromDB = await this.repository.findOne({
      where: {
        age
      }
    })

    return ageFromDB != null
  }

  async ageIdExists(id: string): Promise<boolean> {
    const age = await this.repository.findOne({
      where: {
        id
      }
    })

    return age != null
  }

  async getAll(): Promise<AgeRating[]> {
    const ages = await this.repository.find()

    if (ages === undefined) {
      return []
    }

    return ages
  }
}
