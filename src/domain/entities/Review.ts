import { v4 } from 'uuid'
import { type Owner } from '../value-objects/Owner'

export class Review {
  private id: string
  private owner!: Owner
  constructor(
    private readonly description: string,
    private readonly stars: number,
    private readonly gameId: string,
    private readonly reviewerId: string
  ) {
    this.id = v4()
  }

  setOwner(owner: Owner): void {
    this.owner = owner
  }

  getOwner(): Owner {
    return this.owner
  }

  setId(id: string): void {
    this.id = id
  }

  getId(): string {
    return this.id
  }

  getDescription(): string {
    return this.description
  }

  getStars(): number {
    return this.stars
  }

  getGameId(): string {
    return this.gameId
  }

  getReviewerId(): string {
    return this.reviewerId
  }
}
