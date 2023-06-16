import { Reviewer } from '$/domain/entities/Reviewer'
import { type IReviewerRepository } from '$/domain/repositories/IReviewerRepository'
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
      'SELECT id, passwordTemporary, passwordTempTime, username, password, email FROM reviewers WHERE username = ?',
      [username]
    )

    const rows = result[0] as any[]

    return rows.map((x: any) => {
      const reviewer = new Reviewer(x.username as string, x.password as string, x.email as string)
      reviewer.setPasswordTemporary(x.passwordTemporary as string)
      reviewer.setPasswordTempTime(x.passwordTempTime === null ? null : new Date(x.passwordTempTime as string))

      return reviewer
    })[0]
  }
}
