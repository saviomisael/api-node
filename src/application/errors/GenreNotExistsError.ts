export class GenreNotExistsError extends Error {
  constructor(genreId: string) {
    super(`O gênero ${genreId} não existe.`)
  }
}
