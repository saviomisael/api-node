import { type Reviewer } from '../entities/Reviewer'

export interface IReviewerRepository {
  createReviewer: (reviewer: Reviewer) => Promise<void>
  getReviewerById: (reviewerId: string) => Promise<Reviewer>
  checkUsernameAlreadyExists: (username: string) => Promise<boolean>
}
