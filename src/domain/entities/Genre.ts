import { AggregateRoot } from '$/domain/entities/AggregateRoot'

export class Genre extends AggregateRoot {
  constructor(private readonly name: string) {
    super()
  }

  public getName(): string {
    return this.name
  }
}
