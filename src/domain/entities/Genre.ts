import { AggregateRoot } from '$/domain/entities/AggregateRoot'
import { Column, Entity, Index, OneToMany } from 'typeorm'
import { Game } from './Game'

@Entity('genres')
export class Genre extends AggregateRoot {
  @Column({
    nullable: false,
    length: 256,
    unique: true
  })
  @Index('genre_name_idx', { synchronize: false })
  name!: string

  @OneToMany(() => Game, (game) => game.genres)
  games!: Game
}
