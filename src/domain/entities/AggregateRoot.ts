import { v4 } from 'uuid'

export abstract class AggregateRoot {
  public id: string = v4()
}
