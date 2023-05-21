import { type AgeRating } from './AgeRating'
import { BaseModel } from './BaseModel'
import { type Genre } from './Genre'
import { type Platform } from './Platform'

export class Game extends BaseModel {
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
