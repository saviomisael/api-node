import { PrimaryColumn } from 'typeorm'
import { v4 } from 'uuid'

export abstract class AggregateRoot {
  @PrimaryColumn({
    length: 36
  })
  public id: string = v4()
}
