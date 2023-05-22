import { v4 } from 'uuid'

export abstract class BaseEntity {
  private id: string

  constructor () {
    this.id = v4()
  }

  public getId (): string {
    return this.id
  }

  public setId (id: string): void {
    this.id = id
  }
}
