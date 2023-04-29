import { type Genre } from './Genre'
import { type Platform } from './Platform'

export class Game {
  private readonly id!: string

  constructor (
    private readonly name: string,
    private readonly price: number,
    private readonly description: string,
    private readonly platforms: Platform[],
    private readonly releaseDate: Date,
    private readonly genres: Genre[]
  ) {}
}
