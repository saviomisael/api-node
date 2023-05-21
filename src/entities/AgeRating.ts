import { BaseEntity } from './BaseEntity'

export class AgeRating extends BaseEntity {
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
