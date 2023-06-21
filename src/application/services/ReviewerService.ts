import { type Reviewer } from '$/domain/entities/Reviewer'
import { type IReviewerRepository } from '$/domain/repositories'
import { type ISendEmailService } from '$/domain/services/ISendEmailService'
import { type ReviewerDetails } from '$/domain/value-objects/ReviewerDetails'
import { JWTGenerator, type Payload } from '$/infrastructure/JWTGenerator'
import { PasswordEncrypter } from '$/infrastructure/PasswordEncrypter'
import { ReviewerRepository } from '$/infrastructure/repositories'
import { ChangePasswordEmailService } from '$/infrastructure/services/ChangePasswordEmailService'
import { ForgotPasswordEmailService } from '$/infrastructure/services/ForgotPasswordEmailService'
import RandExp from 'randexp'
import { type ReviewerDTO } from '../dto/ReviewerDTO'
import { type TokenDTO } from '../dto/TokenDTO'
import { CredentialsError, EmailInUseError, ReviewerNotFoundError, UsernameInUseError } from '../errors'

export class ReviewerService {
  private readonly reviewerRepository: IReviewerRepository = new ReviewerRepository()
  private emailService!: ISendEmailService

  async createReviewer(reviewer: Reviewer): Promise<ReviewerDTO> {
    const emailIsInUse = await this.reviewerRepository.checkEmailAlreadyExists(reviewer.email)

    if (emailIsInUse) {
      throw new EmailInUseError(reviewer.email)
    }

    const usernameIsInUse = await this.reviewerRepository.checkUsernameAlreadyExists(reviewer.username)

    if (usernameIsInUse) {
      throw new UsernameInUseError(reviewer.username)
    }

    await this.reviewerRepository.createReviewer(reviewer)
    const newReviewer = await this.reviewerRepository.getReviewerById(reviewer.id)

    const generator = new JWTGenerator()

    const token = generator.generateToken(newReviewer.id, newReviewer.username)

    return {
      token,
      username: newReviewer.username
    }
  }

  async signIn(username: string, password: string): Promise<ReviewerDTO> {
    const usernameAlreadyExists = await this.reviewerRepository.checkUsernameAlreadyExists(username)

    if (!usernameAlreadyExists) {
      throw new ReviewerNotFoundError(username)
    }

    const reviewer = await this.reviewerRepository.getReviewerByUsername(username)

    const passwordTempTimeUnix = reviewer.tempPasswordTime != null ? reviewer.tempPasswordTime?.getTime() : null

    let passwordsAreEqual

    if (passwordTempTimeUnix != null && passwordTempTimeUnix > new Date(new Date().toUTCString()).getTime()) {
      passwordsAreEqual = await PasswordEncrypter.comparePasswords(reviewer.temporaryPassword, password)

      if (passwordsAreEqual) await this.reviewerRepository.removeTemporaryPassword(reviewer.username)
    } else {
      passwordsAreEqual = await PasswordEncrypter.comparePasswords(reviewer.password, password)
    }

    if (!passwordsAreEqual) {
      throw new CredentialsError()
    }

    const generator = new JWTGenerator()

    const token = generator.generateToken(reviewer.id, reviewer.username)

    return {
      token,
      username
    }
  }

  async changePassword(username: string, newPassword: string): Promise<void> {
    const passwordEncrypted = await PasswordEncrypter.encrypt(newPassword)

    await this.reviewerRepository.changePassword(username, passwordEncrypted)

    const [, reviewer] = await Promise.all([
      this.reviewerRepository.changePassword(username, passwordEncrypted),
      this.reviewerRepository.getReviewerByUsername(username)
    ])

    this.emailService = new ChangePasswordEmailService()

    await this.emailService.sendEmail(reviewer.username, reviewer.email)
  }

  async forgotPassword(username: string): Promise<void> {
    const usernameExists = await this.reviewerRepository.checkUsernameAlreadyExists(username)

    if (!usernameExists) {
      throw new ReviewerNotFoundError(username)
    }

    this.emailService = new ForgotPasswordEmailService()

    const randomPassword = new RandExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8}$/).gen()
    const randomPasswordHash = await PasswordEncrypter.encrypt(randomPassword)

    const reviewer = await this.reviewerRepository.getReviewerByUsername(username)
    reviewer.generateTempPasswordTime()
    reviewer.temporaryPassword = randomPasswordHash

    await Promise.all([
      this.reviewerRepository.setTemporaryPassword(reviewer),
      this.emailService.sendEmail(reviewer.username, randomPassword, reviewer.email)
    ])
  }

  refreshToken(payload: Payload): TokenDTO {
    const generator = new JWTGenerator()

    const token = generator.generateToken(payload.sub, payload.name)

    return {
      token
    }
  }

  async deleteReviewerByUsername(username: string): Promise<void> {
    await this.reviewerRepository.deleteReviewerByUsername(username)
  }

  async getDetailsByUsername(username: string): Promise<ReviewerDetails> {
    const usernameExists = await this.reviewerRepository.checkUsernameAlreadyExists(username)

    if (!usernameExists) {
      throw new ReviewerNotFoundError(username)
    }

    return await this.reviewerRepository.getDetailsByUsername(username)
  }
}
