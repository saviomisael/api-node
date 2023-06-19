import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, Index, OneToMany } from 'typeorm'
import { Game } from './Game'

@Entity('platforms')
export class Platform extends AggregateRoot {
  @Column({
    nullable: false,
    unique: true,
    length: 256
  })
  @Index('platform_name_idx', { synchronize: false })
  name!: string

  @OneToMany(() => Game, (game) => game.platforms)
  games!: Game
}
