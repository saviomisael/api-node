import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, Index, JoinTable, OneToMany } from 'typeorm'
import { Game } from './Game'

@Entity('genres')
export class Genre extends AggregateRoot {
  @Column({
    nullable: false,
    length: 256,
    unique: true
  })
  @Index('genres_name', { synchronize: false })
  name!: string

  @OneToMany(() => Game, (game) => game.genres)
  @JoinTable({ name: 'games_genres_genres' })
  games!: Game
}
