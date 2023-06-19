import { AgeRating, type Genre, type Platform } from '$/domain/entities'
import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { type Review } from './Review'

@Entity('games')
export class Game extends AggregateRoot {
  private readonly platforms = new Array<Platform>()
  private readonly genres = new Array<Genre>()
  private readonly reviews = new Array<Review>()

  @Column({
    nullable: false,
    length: 255
  })
  @Index('name_games_idx', { synchronize: false })
  name!: string

  @Column({
    type: 'numeric',
    nullable: false,
    precision: 10,
    scale: 2
  })
  price!: number

  @Column({
    type: 'text',
    nullable: false
  })
  description!: string

  @Column({
    type: 'datetime',
    nullable: false
  })
  releaseDate!: Date

  @ManyToOne(() => AgeRating, (age) => age.games)
  ageRating!: AgeRating

  addReview(review: Review): void {
    this.reviews.push(review)
  }

  addPlatform(platform: Platform): void {
    this.platforms.push(platform)
  }

  addGenre(genre: Genre): void {
    this.genres.push(genre)
  }
}
