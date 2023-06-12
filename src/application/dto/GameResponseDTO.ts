import { type AgeRating, type Genre, type Platform } from '$/domain/entities'

export class GameResponseDTO {
  platforms!: Platform[]
  genres!: Genre[]
  id!: string
  name!: string
  price!: number
  description!: string
  releaseDate!: string
  ageRating!: AgeRating
}
