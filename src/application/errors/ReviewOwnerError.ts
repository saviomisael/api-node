export class ReviewOwnerError extends Error {
  constructor() {
    super('O usuário não é o responsável da review.')
  }
}
