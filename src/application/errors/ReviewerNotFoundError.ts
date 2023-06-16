export class ReviewerNotFoundError extends Error {
  constructor(username: string) {
    super(`O usuário ${username} não existe.`)
  }
}
