import { Reviewer } from '$/domain/entities/Reviewer'
import { type IReviewerRepository } from '$/domain/repositories/IReviewerRepository'
import { ReviewerDetails } from '$/domain/value-objects/ReviewerDetails'
import { type Connection } from 'mysql2/promise'
import { AppDataSource } from '../AppDataSource'
import { DBConnection } from '../DBConnection'

export class ReviewerRepository implements IReviewerRepository {
  private connection!: Connection
  private readonly repository = AppDataSource.getRepository(Reviewer)
  async createReviewer(reviewer: Reviewer): Promise<void> {
    await this.repository.save(reviewer)
  }

  async getReviewerById(id: string): Promise<Reviewer> {
    const reviewer = await this.repository.findOne({ where: { id } })

    if (reviewer == null) return new Reviewer()

    return reviewer
  }

  async checkUsernameAlreadyExists(username: string): Promise<boolean> {
    const reviewer = await this.repository.findOne({ where: { username } })

    return reviewer != null
  }

  async checkEmailAlreadyExists(email: string): Promise<boolean> {
    const reviewer = await this.repository.findOne({ where: { email } })

    return reviewer != null
  }

  async getReviewerByUsername(username: string): Promise<Reviewer> {
    const reviewer = await this.repository.findOne({ where: { username } })

    if (reviewer == null) return new Reviewer()

    return reviewer
  }

  async changePassword(username: string, newPassword: string): Promise<void> {
    const reviewer = await this.repository.findOneBy({ username })

    if (reviewer != null) {
      reviewer.password = newPassword

      await this.repository.save(reviewer)
    }
  }

  async setTemporaryPassword(reviewer: Reviewer): Promise<void> {
    const reviewerFromDB = await this.repository.findOne({ where: { username: reviewer.username } })

    if (reviewerFromDB != null) {
      reviewerFromDB.temporaryPassword = reviewer.temporaryPassword
      reviewerFromDB.tempPasswordTime = reviewer.tempPasswordTime

      await this.repository.save(reviewerFromDB)
    }
  }

  async deleteReviewerByUsername(username: string): Promise<void> {
    // TODO delete reviews by reviewer

    await this.repository.delete({ username })
  }

  async removeTemporaryPassword(username: string): Promise<void> {
    const reviewer = await this.repository.findOne({ where: { username } })

    if (reviewer != null) {
      reviewer.temporaryPassword = ''
      reviewer.tempPasswordTime = null
    }
  }

  async getDetailsByUsername(username: string): Promise<ReviewerDetails> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      `
      SELECT
      r.createdAtUtcTime AS createdAt,
      r.username,
      GROUP_CONCAT(rv.id) AS reviews_ids
      FROM reviewers AS r
      JOIN reviews AS rv ON rv.fk_reviewer = r.id
      WHERE r.username = ?
      GROUP BY r.id
      `,
      [username]
    )

    const rows = result[0] as any[]

    return rows.map((x: any) => {
      const details = new ReviewerDetails()
      details.createdAt = new Date(x.createdAt as string)
      details.username = x.username
      details.reviewsCount = x.reviews_ids.split(',').length

      return details
    })[0]
  }
}
