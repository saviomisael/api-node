import { AggregateRoot } from '$/domain/entities/AggregateRoot'

export class AgeRating extends AggregateRoot {
  constructor (
    private readonly age: string,
    private readonly description: string
  ) {
    super()
  }

  getAge (): string {
    return this.age
  }

  getDescription (): string {
    return this.description
  }
}
