import { v4 } from 'uuid'

export class Review {
  private readonly id: string
  constructor(private readonly description: string, private readonly stars: number) {
    this.id = v4()
  }
}
