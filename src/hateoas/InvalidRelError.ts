export class InvalidRelError extends Error {
  constructor () {
    super('You must use addSelfLink method instead.')
  }
}
