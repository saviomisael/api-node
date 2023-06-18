export class ReviewerAlreadyHasReviewError extends Error {
  constructor() {
    super('Você já fez uma review para esse jogo.')
  }
}
