export class UsernameInUseError extends Error {
  constructor(username: string) {
    super(`O usuário ${username} já existe.`)
  }
}
