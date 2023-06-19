import { Reviewer } from '$/domain/entities/Reviewer'
import { PasswordEncrypter } from '$/infrastructure/PasswordEncrypter'
import { type CreateReviewerDTO } from '../dto'

export class ReviewerMapper {
  private constructor() {}

  static async fromCreateReviewerDTOToEntity(dto: CreateReviewerDTO): Promise<Reviewer> {
    const reviewer = new Reviewer()
    reviewer.username = dto.username
    reviewer.password = await PasswordEncrypter.encrypt(dto.password)
    reviewer.email = dto.email

    return reviewer
  }
}
