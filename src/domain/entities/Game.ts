import { AgeRating, Genre, Platform, Review } from '$/domain/entities'
import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'

@Entity('games')
export class Game extends AggregateRoot {
  @ManyToMany(() => Platform, {
    cascade: true
  })
  @JoinTable({ name: 'games_platforms_platforms' })
  platforms!: Platform[]

  @ManyToMany(() => Genre, {
    cascade: true
  })
  @JoinTable({ name: 'games_genres_genres' })
  genres!: Genre[]

  @OneToMany(() => Review, (review) => review.game, { cascade: true })
  reviews!: Review[]

  @Column({
    nullable: false,
    length: 255
  })
  @Index('name_games_idx', { fulltext: true })
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
    if (this.reviews === undefined) this.reviews = []
    this.reviews.push(review)
  }

  addPlatform(platform: Platform): void {
    if (this.platforms === undefined) this.platforms = []
    this.platforms.push(platform)
  }

  addGenre(genre: Genre): void {
    if (this.genres === undefined) this.genres = []
    this.genres.push(genre)
  }
}
