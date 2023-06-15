import { type Reviewer } from '$/domain/entities/Reviewer'
import { type IReviewerRepository } from '$/domain/repositories/IReviewerRepository'
import { type Connection } from 'mysql2/promise'
import { DBConnection } from '../DBConnection'

export class ReviewerRepository implements IReviewerRepository {
  private connection!: Connection
  async createReviewer(reviewer: Reviewer): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute('INSERT INTO reviewers (id, createdAtUtcTime, username, password, email)', [
      reviewer.id,
      reviewer.getCreatedAtUtcTime(),
      reviewer.getUsername(),
      reviewer.getPassword(),
      reviewer.getEmail()
    ])
  }

  async getReviewerById(reviewerId: string): Promise<Reviewer> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT * FROM reviewers WHERE id = ?', [reviewerId])

    const rows = result[0] as Reviewer[]

    return rows[0]
  }
}
