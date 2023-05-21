import { type AgeRating } from '../../model/AgeRating'

export interface IAgeRatingRepository {
  create: (ageRating: AgeRating) => Promise<void>
  ageAlreadyExists: (age: string) => Promise<boolean>
}
