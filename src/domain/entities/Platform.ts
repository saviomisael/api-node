import { AggregateRoot } from '$/domain/entities/AggregateRoot'

export class Platform extends AggregateRoot {
  constructor (private readonly name: string) {
    super()
  }

  getName (): string {
    return this.name
  }
}
