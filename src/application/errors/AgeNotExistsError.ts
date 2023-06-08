export class AgeNotExistsError extends Error {
  constructor () {
    super('Idade provida não existe.')
  }
}
