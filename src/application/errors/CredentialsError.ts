export class CredentialsError extends Error {
  constructor() {
    super('O nome de usuário ou a senha estão incorretos.')
  }
}
