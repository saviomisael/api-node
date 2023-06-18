export class ReviewNotFoundError extends Error {
  constructor() {
    super('Review não existe.')
  }
}
