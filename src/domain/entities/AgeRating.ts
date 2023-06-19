import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, OneToMany } from 'typeorm'
import { Game } from './Game'

@Entity('ageRatings')
export class AgeRating extends AggregateRoot {
  @Column({
    nullable: false,
    unique: true,
    length: 3
  })
  age!: string

  @Column({
    nullable: false,
    length: 256
  })
  description!: string

  @OneToMany(() => Game, (game) => game.ageRating)
  games!: Game[]
}
