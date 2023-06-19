import { HasRelatedGamesError } from '$/application/errors/HasRelatedGamesError'
import { GenreService } from '$/application/services/GenreService'
import { Genre } from '$/domain/entities'
import { type IGenreRepository } from '$/domain/repositories'
import { NotImplementedError } from '$/test/NotImplementedError'
import chai from 'chai'

describe('GenreService', () => {
  it('should throw a HasRelatedGamesError', async () => {
    const GenreRepositoryMock = new (class implements IGenreRepository {
      async createGenre(_: Genre): Promise<void> {
        throw new NotImplementedError()
      }

      async getGenreById(_: string): Promise<Genre | null> {
        return new Genre()
      }

      async getGenreByName(_: string): Promise<Genre | null> {
        throw new NotImplementedError()
      }

      async getAll(): Promise<Genre[]> {
        throw new NotImplementedError()
      }

      async deleteGenreById(_: string): Promise<void> {
        throw new NotImplementedError()
      }

      async hasRelatedGames(_: string): Promise<boolean> {
        return true
      }
    })()

    const genreService = new GenreService(GenreRepositoryMock)

    try {
      await genreService.deleteGenre('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')
    } catch (error: any) {
      chai.expect(error instanceof HasRelatedGamesError).to.be.true
    }
  })
})
