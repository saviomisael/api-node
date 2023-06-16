import { Reviewer } from '$/domain/entities/Reviewer'
import { PasswordEncrypter } from '$/infrastructure/PasswordEncrypter'
import { type CreateReviewerDTO } from '../dto'

export class ReviewerMapper {
  private constructor() {}

  static async fromCreateReviewerDTOToEntity(dto: CreateReviewerDTO): Promise<Reviewer> {
    return new Reviewer(dto.username, await PasswordEncrypter.encrypt(dto.password), dto.email)
  }
}
