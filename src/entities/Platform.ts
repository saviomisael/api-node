import { BaseEntity } from './BaseEntity'

export class Platform extends BaseEntity {
  constructor (private readonly name: string) {
    super()
  }

  getName (): string {
    return this.name
  }
}
