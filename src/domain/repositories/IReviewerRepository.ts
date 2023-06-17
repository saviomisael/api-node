import { type Reviewer } from '../entities/Reviewer'

export interface IReviewerRepository {
  createReviewer: (reviewer: Reviewer) => Promise<void>
  getReviewerById: (reviewerId: string) => Promise<Reviewer>
  checkUsernameAlreadyExists: (username: string) => Promise<boolean>
  checkEmailAlreadyExists: (email: string) => Promise<boolean>
  getReviewerByUsername: (username: string) => Promise<Reviewer>
  changePassword: (username: string, newPassword: string) => Promise<void>
  setTemporaryPassword: (reviewer: Reviewer) => Promise<void>
}
