import { type Game } from '../entities'

export interface IGameRepository {
  create: (game: Game) => Promise<void>
  getById: (gameId: string) => Promise<Game | null>
}
