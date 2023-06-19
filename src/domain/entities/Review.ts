import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { v4 } from 'uuid'
import { type Owner } from '../value-objects/Owner'
import { Game } from './Game'
import { Reviewer } from './Reviewer'

@Entity('reviews')
export class Review {
  @PrimaryColumn()
  id: string = v4()

  private owner!: Owner
  @Column({
    nullable: false,
    type: 'text'
  })
  description!: string

  @Column({
    nullable: false,
    type: 'smallint'
  })
  stars!: number

  @ManyToOne(() => Game, (game) => game.reviews)
  game!: Game

  @ManyToOne(() => Reviewer, (reviewer) => reviewer.reviews)
  reviewer!: Reviewer

  setOwner(owner: Owner): void {
    this.owner = owner
  }

  getOwner(): Owner {
    return this.owner
  }
}
