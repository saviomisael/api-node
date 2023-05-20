import { type Connection } from 'mysql2/promise'
import { type AgeRating } from '../../model/AgeRating'
import { DBConnection } from '../DBConnection'
import { type IAgeRatingRepository } from './IAgeRatingRepository'

export class AgeRatingRepository implements IAgeRatingRepository {
  private connection!: Connection

  async create (ageRating: AgeRating): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection
      .execute('INSERT INTO ageRatings (id, age, description) VALUE (?, ?, ?)',
        [ageRating.getId(), ageRating.getAge(), ageRating.getDescription()])
  }
}
