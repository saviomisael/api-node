import { BaseEntity } from '$/domain/entities/BaseEntity'

export class Genre extends BaseEntity {
  constructor (private readonly name: string) {
    super()
  }

  public getName (): string {
    return this.name
  }
}
