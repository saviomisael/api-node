import { AgeRating, Genre, Platform, Review } from '$/domain/entities'
import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, Index, ManyToMany, ManyToOne, OneToMany } from 'typeorm'

@Entity('games')
export class Game extends AggregateRoot {
  @ManyToMany(() => Platform, {
    cascade: true
  })
  platforms!: Platform[]

  @ManyToMany(() => Genre, {
    cascade: true
  })
  genres!: Genre[]

  @OneToMany(() => Review, (review) => review.game)
  reviews!: Review[]

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
