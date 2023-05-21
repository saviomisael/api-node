import { type AgeRating } from './AgeRating'
import { BaseEntity } from './BaseEntity'
import { type Genre } from './Genre'
import { type Platform } from './Platform'

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
