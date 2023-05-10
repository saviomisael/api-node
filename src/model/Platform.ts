import { BaseModel } from './BaseModel'

export class Platform extends BaseModel {
  constructor (private readonly name: string) {
    super()
  }

  getName (): string {
    return this.name
  }
}
