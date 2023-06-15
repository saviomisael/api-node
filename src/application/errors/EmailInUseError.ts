export class EmailInUseError extends Error {
  constructor(email: string) {
    super(`O email ${email} já está sendo usado.`)
  }
}
