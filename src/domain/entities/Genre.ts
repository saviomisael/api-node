import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity } from 'typeorm'

@Entity('genres')
export class Genre extends AggregateRoot {
  @Column({
    nullable: false,
    length: 256,
    unique: true
  })
  name!: string
}
