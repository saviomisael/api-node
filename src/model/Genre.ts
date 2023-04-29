import { BaseModel } from './BaseModel'

export class Genre extends BaseModel {
  constructor (private readonly name: string) {
    super()
  }

  public getName (): string {
    return this.name
  }
}
