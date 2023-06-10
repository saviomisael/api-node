import { type Game } from '../entities'

export interface IGameRepository {
  create: (game: Game) => Promise<void>
  getById: (gameId: string) => Promise<Game | null>
  updateGame: (newGame: Game) => Promise<void>
  deleteGameById: (gameId: string) => Promise<void>
  getAll: (page: number, sortType: 'releaseDate', sortOrder: 'ASC' | 'DESC') => Promise<Game[]>
  getMaxPages: () => Promise<number>
}
