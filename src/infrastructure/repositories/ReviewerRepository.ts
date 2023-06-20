import { Review } from '$/domain/entities'
import { Reviewer } from '$/domain/entities/Reviewer'
import { type IReviewerRepository } from '$/domain/repositories/IReviewerRepository'
import { ReviewerDetails } from '$/domain/value-objects/ReviewerDetails'
import { AppDataSource } from '../AppDataSource'

export class ReviewerRepository implements IReviewerRepository {
  private readonly reviewerRepository = AppDataSource.getRepository(Reviewer)
  private readonly reviewsRepository = AppDataSource.getRepository(Review)

  async createReviewer(reviewer: Reviewer): Promise<void> {
    await this.reviewerRepository.save(reviewer)
  }

  async getReviewerById(id: string): Promise<Reviewer> {
    const reviewer = await this.reviewerRepository.findOne({ where: { id } })

    if (reviewer == null) return new Reviewer()

    return reviewer
  }

  async checkUsernameAlreadyExists(username: string): Promise<boolean> {
    const reviewer = await this.reviewerRepository.findOne({ where: { username } })

    return reviewer != null
  }

  async checkEmailAlreadyExists(email: string): Promise<boolean> {
    const reviewer = await this.reviewerRepository.findOne({ where: { email } })

    return reviewer != null
  }

  async getReviewerByUsername(username: string): Promise<Reviewer> {
    const reviewer = await this.reviewerRepository.findOne({ where: { username } })

    if (reviewer == null) return new Reviewer()

    return reviewer
  }

  async changePassword(username: string, newPassword: string): Promise<void> {
    const reviewer = await this.reviewerRepository.findOneBy({ username })

    if (reviewer != null) {
      reviewer.password = newPassword

      await this.reviewerRepository.save(reviewer)
    }
  }

  async setTemporaryPassword(reviewer: Reviewer): Promise<void> {
    const reviewerFromDB = await this.reviewerRepository.findOne({ where: { username: reviewer.username } })

    if (reviewerFromDB != null) {
      reviewerFromDB.temporaryPassword = reviewer.temporaryPassword
      reviewerFromDB.tempPasswordTime = reviewer.tempPasswordTime

      await this.reviewerRepository.save(reviewerFromDB)
    }
  }

  async deleteReviewerByUsername(username: string): Promise<void> {
    await this.reviewerRepository.delete({ username })
  }

  async removeTemporaryPassword(username: string): Promise<void> {
    const reviewer = await this.reviewerRepository.findOne({ where: { username } })

    if (reviewer != null) {
      reviewer.temporaryPassword = ''
      reviewer.tempPasswordTime = null

      await this.createReviewer(reviewer)
    }
  }

  async getDetailsByUsername(username: string): Promise<ReviewerDetails> {
    const details = new ReviewerDetails()

    const reviews = await this.reviewsRepository.find({
      where: { reviewer: { username } },
      relations: { reviewer: true },
      select: { id: true, reviewer: { createdAtUtcTime: true, username: true } }
    })

    if (reviews.length === 0) return details

    details.createdAt = reviews[0].reviewer.createdAtUtcTime
    details.reviewsCount = reviews.length
    details.username = reviews[0].reviewer.username

    return details
  }
}
