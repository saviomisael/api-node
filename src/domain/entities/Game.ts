import { type AgeRating, type Genre, type Platform } from '$/domain/entities'
import { AggregateRoot } from '$/domain/entities/AggregateRoot'
export class Game extends AggregateRoot {
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
