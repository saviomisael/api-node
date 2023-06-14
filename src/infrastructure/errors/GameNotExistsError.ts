export class GameNotExistsError extends Error {
  constructor() {
    super('O jogo não existe.')
  }
}
