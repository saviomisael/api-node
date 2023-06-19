import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity } from 'typeorm'

@Entity('platforms')
export class Platform extends AggregateRoot {
  @Column({
    nullable: false,
    unique: true,
    length: 256
  })
  name!: string
}
