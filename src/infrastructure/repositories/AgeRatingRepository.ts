import { type AgeRating } from '$/domain/entities'
import { type IAgeRatingRepository } from '$/domain/repositories/IAgeRatingRepository'
import { DBConnection } from '$/infrastructure/DBConnection'
import { type Connection } from 'mysql2/promise'

export class AgeRatingRepository implements IAgeRatingRepository {
  private connection!: Connection

  async create (ageRating: AgeRating): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection
      .execute('INSERT INTO ageRatings (id, age, description) VALUE (?, ?, ?)',
        [ageRating.getId(), ageRating.getAge(), ageRating.getDescription()])
  }

  async ageAlreadyExists (age: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection
      .execute('SELECT age FROM ageRatings WHERE age = ?',
        [age])

    const rows = result[0] as any[]

    return rows.length > 0
  }

  async getAll (): Promise<AgeRating[]> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM ageRatings')

    const data = result[0] as AgeRating[]

    return data
  }
}
