import { type Reviewer } from '$/domain/entities/Reviewer'
import { type IReviewerRepository } from '$/domain/repositories/IReviewerRepository'
import { JWTGenerator } from '$/infrastructure/JWTGenerator'
import { PasswordEncrypter } from '$/infrastructure/PasswordEncrypter'
import { ReviewerRepository } from '$/infrastructure/repositories/ReviewerRepository'
import { type TokenDTO } from '../dto/TokenDTO'
import { CredentialsError, EmailInUseError, ReviewerNotFoundError, UsernameInUseError } from '../errors'

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

  async signIn(username: string, password: string): Promise<TokenDTO> {
    const usernameAlreadyExists = await this.reviewerRepository.checkUsernameAlreadyExists(username)

    if (!usernameAlreadyExists) {
      throw new ReviewerNotFoundError(username)
    }

    const reviewer = await this.reviewerRepository.getReviewerByUsername(username)

    const passwordsAreEqual = await PasswordEncrypter.comparePasswords(reviewer.getPassword(), password)

    if (!passwordsAreEqual) {
      throw new CredentialsError()
    }

    const generator = new JWTGenerator()

    const token = generator.generateToken(reviewer.id, reviewer.getUsername())

    return {
      token
    }
  }

  async changePassword(username: string, newPassword: string): Promise<void> {
    const passwordEncrypted = await PasswordEncrypter.encrypt(newPassword)

    await this.reviewerRepository.changePassword(username, passwordEncrypted)
  }
}
