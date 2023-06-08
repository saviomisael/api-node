import { type AgeRating } from '$/domain/entities'

export interface IAgeRatingRepository {
  create: (ageRating: AgeRating) => Promise<void>
  ageAlreadyExists: (age: string) => Promise<boolean>
  ageIdExists: (ageId: string) => Promise<boolean>
  getAll: () => Promise<AgeRating[]>
}
