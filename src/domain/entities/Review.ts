import { v4 } from 'uuid'
import { type Reviewer } from './Reviewer'

export class Review {
  private id: string
  private owner!: Reviewer
  constructor(
    private readonly description: string,
    private readonly stars: number,
    private readonly gameId: string,
    private readonly reviewerId: string
  ) {
    this.id = v4()
  }

  setOwner(reviewer: Reviewer): void {
    this.owner = reviewer
  }

  getOwner(): Reviewer {
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
