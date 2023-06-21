import { type Game } from '../entities'
import { type Review } from '../entities/Review'

export interface IGameRepository {
  create: (game: Game) => Promise<void>
  getById: (gameId: string) => Promise<Game | null>
  updateGame: (newGame: Game) => Promise<void>
  deleteGameById: (gameId: string) => Promise<void>
  getAll: (page: number, sortType: 'releaseDate' | 'reviewsCount', sortOrder: 'ASC' | 'DESC') => Promise<Game[]>
  getMaxPages: () => Promise<number>
  searchByTerm: (
    term: string,
    page: number,
    sortType: 'releaseDate' | 'reviewsCount',
    sortOrder: 'ASC' | 'DESC'
  ) => Promise<Game[]>
  getMaxPagesBySearch: (term: string) => Promise<number>
  createReview: (review: Review) => Promise<void>
  verifyGameAlreadyExists: (gameId: string) => Promise<boolean>
  updateReview: (review: Review) => Promise<void>
  checkReviewExists: (reviewId: string) => Promise<boolean>
  getUserForReview: (reviewId: string) => Promise<string>
  checkReviewerHasReviewByGame: (reviewerId: string, gameId: string) => Promise<boolean>
  getReviewsByGame: (gameId: string) => Promise<Review[]>
}
