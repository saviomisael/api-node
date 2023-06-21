import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, Index, JoinTable, OneToMany } from 'typeorm'
import { Game } from './Game'

@Entity('platforms')
export class Platform extends AggregateRoot {
  @Column({
    nullable: false,
    unique: true,
    length: 256
  })
  @Index('platforms_name', { synchronize: false })
  name!: string

  @OneToMany(() => Game, (game) => game.platforms)
  @JoinTable({ name: 'games_platforms_platforms' })
  games!: Game
}
