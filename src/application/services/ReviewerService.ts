import { type Reviewer } from '$/domain/entities/Reviewer'
import { type IReviewerRepository } from '$/domain/repositories/IReviewerRepository'
import { JWTGenerator } from '$/infrastructure/JWTGenerator'
import { ReviewerRepository } from '$/infrastructure/repositories/ReviewerRepository'
import { type TokenDTO } from '../dto/TokenDTO'
import { EmailInUseError } from '../errors/EmailInUseError'
import { UsernameInUseError } from '../errors/UsernameInUseError'

export class ReviewerService {
  private readonly reviewerRepository: IReviewerRepository = new ReviewerRepository()

  async createReviewer(reviewer: Reviewer): Promise<TokenDTO> {
    const emailIsInUse = await this.reviewerRepository.checkEmailAlreadyExists(reviewer.getEmail())

    if (emailIsInUse) {
      throw new EmailInUseError(reviewer.getEmail())
    }

    const usernameIsInUse = await this.reviewerRepository.checkUsernameAlreadyExists(reviewer.getUsername())

    if (usernameIsInUse) {
      throw new UsernameInUseError(reviewer.getUsername())
    }

    const [, newReviewer] = await Promise.all([
      this.reviewerRepository.createReviewer(reviewer),
      this.reviewerRepository.getReviewerById(reviewer.id)
    ])

    const generator = new JWTGenerator()

    const token = generator.generateToken(newReviewer.id, newReviewer.getUsername())

    return {
      token
    }
  }
}
