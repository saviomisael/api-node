import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, Index } from 'typeorm'

@Entity('genres')
export class Genre extends AggregateRoot {
  @Column({
    nullable: false,
    length: 256,
    unique: true
  })
  @Index('genre_name_idx', { synchronize: false })
  name!: string
}
