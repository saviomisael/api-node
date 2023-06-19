import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, Index } from 'typeorm'

@Entity('platforms')
export class Platform extends AggregateRoot {
  @Column({
    nullable: false,
    unique: true,
    length: 256
  })
  @Index('platform_name_idx', { synchronize: false })
  name!: string
}
