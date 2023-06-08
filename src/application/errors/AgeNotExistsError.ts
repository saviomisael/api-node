export class AgeNotExistsError extends Error {
  constructor () {
    super('Faixa etária provida não existe.')
  }
}
