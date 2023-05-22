import { type AgeRating, type Genre, type Platform } from '$/domain/entities'
import { BaseEntity } from '$/domain/entities/BaseEntity'
export class Game extends BaseEntity {
  constructor (
    private readonly name: string,
    private readonly price: number,
    private readonly description: string,
    private readonly platforms: Set<Platform>,
    private readonly releaseDate: Date,
    private readonly genres: Set<Genre>,
    private readonly ageRating: AgeRating
  ) {
    super()
  }
}
