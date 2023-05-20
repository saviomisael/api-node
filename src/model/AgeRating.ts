import { BaseModel } from './BaseModel'

export class AgeRating extends BaseModel {
  constructor (private readonly age: string,
    private readonly description: string) {
    super()
  }

  getAge (): string {
    return this.age
  }

  getDescription (): string {
    return this.description
  }
}
