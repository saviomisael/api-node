import { Reviewer } from '$/domain/entities/Reviewer'
import { PasswordCrypter } from '$/infrastructure/PasswordCrypter'
import { type CreateReviewerDTO } from '../dto'

export class ReviewerMapper {
  private constructor() {}

  static async fromCreateReviewerDTOToEntity(dto: CreateReviewerDTO): Promise<Reviewer> {
    return new Reviewer(dto.username, await PasswordCrypter.encrypt(dto.password), dto.email)
  }
}
