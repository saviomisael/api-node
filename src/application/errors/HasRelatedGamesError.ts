export class HasRelatedGamesError extends Error {
  constructor(item: string) {
    super(`Existem jogos cadastrados usando o id ${item}.`)
  }
}
