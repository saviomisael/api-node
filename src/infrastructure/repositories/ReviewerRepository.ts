import { Reviewer } from '$/domain/entities/Reviewer'
import { type IReviewerRepository } from '$/domain/repositories/IReviewerRepository'
import { ReviewerDetails } from '$/domain/value-objects/ReviewerDetails'
import { type Connection } from 'mysql2/promise'
import { DBConnection } from '../DBConnection'

export class ReviewerRepository implements IReviewerRepository {
  private connection!: Connection
  async createReviewer(reviewer: Reviewer): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute(
      'INSERT INTO reviewers (id, createdAtUtcTime, username, password, email) VALUES (?, ?, ?, ?, ?)',
      [reviewer.id, reviewer.getCreatedAtUtcTime(), reviewer.getUsername(), reviewer.getPassword(), reviewer.getEmail()]
    )
  }

  async getReviewerById(reviewerId: string): Promise<Reviewer> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      'SELECT id, username, password, email, createdAtUtcTime FROM reviewers WHERE id = ?',
      [reviewerId]
    )

    const rows = result[0] as any[]

    return rows.map((x) => {
      const reviewer = new Reviewer(x.username as string, x.password as string, x.email as string)
      reviewer.id = x.id
      reviewer.setCreatedAtUtcTime(new Date(x.createdAtUtcTime as string))
      return reviewer
    })[0]
  }

  async checkUsernameAlreadyExists(username: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT username FROM reviewers WHERE username = ?', [username])

    const rows = result[0] as any[]

    return rows.length > 0
  }

  async checkEmailAlreadyExists(email: string): Promise<boolean> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute('SELECT email FROM reviewers WHERE email = ?', [email])

    const rows = result[0] as any[]

    return rows.length > 0
  }

  async getReviewerByUsername(username: string): Promise<Reviewer> {
    this.connection = await DBConnection.getConnection()

    const result = await this.connection.execute(
      'SELECT id, temporaryPassword, tempPasswordTime, username, password, email FROM reviewers WHERE username = ?',
      [username]
    )

    const rows = result[0] as any[]

    return rows.map((x: any) => {
      const reviewer = new Reviewer(x.username as string, x.password as string, x.email as string)
      reviewer.setTemporaryPassword(x.temporaryPassword as string)
      reviewer.setTempPasswordTime(x.tempPasswordTime === null ? null : new Date(x.tempPasswordTime as string))
      reviewer.id = x.id

      return reviewer
    })[0]
  }

  async changePassword(username: string, newPassword: string): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute('UPDATE reviewers SET password = ? WHERE username = ?', [newPassword, username])
  }

  async setTemporaryPassword(reviewer: Reviewer): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute(
      'UPDATE reviewers SET temporaryPassword = ?, tempPasswordTime = ? WHERE username = ?',
      [reviewer.getTemporaryPassword(), reviewer.getTempPasswordTime(), reviewer.getUsername()]
    )
  }

  async deleteReviewerByUsername(username: string): Promise<void> {
    this.connection = await DBConnection.getConnection()

    const reviewer = await this.getReviewerByUsername(username)

    await Promise.all([
      this.connection.execute('DELETE FROM reviews WHERE fk_reviewer = ?', [reviewer.id]),
      this.connection.execute('DELETE FROM reviewers WHERE username = ?', [username])
    ])
  }

  async removeTemporaryPassword(username: string): Promise<void> {
    this.connection = await DBConnection.getConnection()

    await this.connection.execute(
      `UPDATE reviewers SET temporaryPassword = '', tempPasswordTime = NULL WHERE username = ?`,
      [username]
    )
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
