import { newDateUtcTime } from '$/infrastructure/constants'
import { Column, Entity, Index, OneToMany } from 'typeorm'
import { addHoursHelper } from '../helpers/addHoursHelper'
import { AggregateRoot } from './AggregateRoot'
import { Review } from './Review'

@Entity('reviewers')
export class Reviewer extends AggregateRoot {
  @Column({
    length: 60,
    default: "''"
  })
  temporaryPassword!: string

  @Column({ type: 'datetime', nullable: true, default: 'null' })
  tempPasswordTime!: Date | null

  @Column({
    type: 'datetime',
    nullable: false
  })
  createdAtUtcTime: Date = newDateUtcTime()

  @Column({
    length: 255,
    nullable: false
  })
  @Index('username_reviewers_idx', { synchronize: false })
  username!: string

  @Column({
    length: 60,
    nullable: false
  })
  password!: string

  @Column({
    length: 255,
    nullable: false
  })
  @Index('email_reviewers_idx', { synchronize: false })
  email!: string

  @OneToMany(() => Review, (review) => review.reviewer, { cascade: true })
  reviews!: Review[]

  generateTempPasswordTime(): void {
    this.tempPasswordTime = addHoursHelper(newDateUtcTime(), 1)
  }
}
