import { type AgeRating, type Genre, type Platform } from '$/domain/entities'
import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { type Review } from './Review'
export class Game extends AggregateRoot {
  private readonly platforms!: Set<Platform>
  private readonly genres!: Set<Genre>
  private readonly reviews: Review[]
  constructor(
    private readonly name: string,
    private readonly price: number,
    private readonly description: string,
    private readonly releaseDate: Date,
    private readonly ageRating: AgeRating
  ) {
    super()
    this.platforms = new Set()
    this.genres = new Set()
    this.reviews = []
  }

  addReview(review: Review): void {
    this.reviews.push(review)
  }

  addPlatform(platform: Platform): void {
    this.platforms.add(platform)
  }

  addGenre(genre: Genre): void {
    this.genres.add(genre)
  }

  getName(): string {
    return this.name
  }

  getPrice(): number {
    return this.price
  }

  getDescription(): string {
    return this.description
  }

  getReleaseDate(): Date {
    return this.releaseDate
  }

  getAgeRating(): AgeRating {
    return this.ageRating
  }

  getPlatforms(): Set<Platform> {
    return this.platforms
  }

  getGenres(): Set<Genre> {
    return this.genres
  }
}
