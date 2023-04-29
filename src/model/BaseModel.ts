import { v4 } from 'uuid'

export abstract class BaseModel {
  private readonly id: string

  constructor () {
    this.id = v4()
  }

  public getId (): string {
    return this.id
  }
}
