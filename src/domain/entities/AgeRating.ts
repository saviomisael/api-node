import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity } from 'typeorm'

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
}
