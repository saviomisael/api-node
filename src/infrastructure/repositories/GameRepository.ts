import { AgeRating, Game, Genre, Platform, Reviewer } from '$/domain/entities'
import { Review } from '$/domain/entities/Review'
import { type IGameRepository } from '$/domain/repositories'
import { Owner } from '$/domain/value-objects/Owner'
import { AppDataSource } from '../AppDataSource'
import { maxGamesPerPage } from '../constants'

export class GameRepository implements IGameRepository {
  private readonly gameRepository = AppDataSource.getRepository(Game)
  private readonly reviewRepository = AppDataSource.getRepository(Review)
  private readonly reviewerRepository = AppDataSource.getRepository(Reviewer)

  async getById(id: string): Promise<Game | null> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: {
        ageRating: true,
        platforms: true,
        genres: true,
        reviews: true
      }
    })

    return game
  }

  async create(game: Game): Promise<void> {
    const age = new AgeRating()
    age.id = game.ageRating.id

    const genres = game.genres.map((x) => {
      const genre = new Genre()
      genre.id = x.id
      return genre
    })

    const platforms = game.platforms.map((x) => {
      const platform = new Platform()
      platform.id = x.id
      return platform
    })
    game.ageRating = age
    game.genres = genres
    game.platforms = platforms

    await this.gameRepository.save(game)
  }

  async updateGame(game: Game): Promise<void> {
    const entity = await this.gameRepository.findOne({
      where: { id: game.id },
      relations: { ageRating: true, genres: true, platforms: true }
    })

    if (entity != null) {
      await this.gameRepository
        .createQueryBuilder()
        .relation(Game, 'genres')
        .of(entity)
        .addAndRemove(game.genres, entity.genres)

      await this.gameRepository
        .createQueryBuilder()
        .relation(Game, 'platforms')
        .of(entity)
        .addAndRemove(game.platforms, entity.platforms)

      await this.gameRepository
        .createQueryBuilder()
        .update()
        .set({
          ageRating: game.ageRating,
          description: game.description,
          name: game.name,
          price: game.price,
          releaseDate: game.releaseDate
        })
        .where('id = :id', { id: game.id })
        .execute()
    }
  }

  async deleteGameById(gameId: string): Promise<void> {
    await this.gameRepository.delete(gameId)
  }

  async getAll(page: number, sortType: 'releaseDate' | 'reviewsCount', sortOrder: 'ASC' | 'DESC'): Promise<Game[]> {
    if (sortType === 'reviewsCount') {
      const ids = await this.gameRepository
        .createQueryBuilder('g')
        .select('g.id')
        .leftJoin('g.reviews', 'rw')
        .groupBy('g.id')
        .orderBy('COUNT(rw.id)', sortOrder)
        .getMany()

      return await this.paginateInMemory(page, ids)
    }

    const releaseOrder = {
      releaseDate: sortOrder
    }

    const skip = page < 2 ? 0 : (page - 1) * maxGamesPerPage

    return await this.gameRepository.find({
      relations: {
        ageRating: true,
        platforms: true,
        genres: true
      },
      order: releaseOrder,
      take: maxGamesPerPage,
      skip
    })
  }

  async searchByTerm(
    term: string,
    page: number,
    sortType: 'releaseDate' | 'reviewsCount',
    sortOrder: 'ASC' | 'DESC'
  ): Promise<Game[]> {
    term = `+${term}`

    if (sortType === 'reviewsCount') {
      const games = await this.gameRepository
        .createQueryBuilder('g')
        .innerJoinAndSelect('g.platforms', 'p')
        .innerJoinAndSelect('g.genres', 'gr')
        .innerJoinAndSelect('g.ageRating', 'a')
        .leftJoin('g.reviews', 'rw')
        .where('to_tsvector(g.name) @@ to_tsquery(:query)', { query: term })
        .orWhere('to_tsvector(p.name) @@ to_tsquery(:query)', { query: term })
        .orWhere('to_tsvector(gr.name) @@ to_tsquery(:query)', { query: term })
        .orderBy('COUNT(rw.id)', sortOrder)
        .skip(page < 2 ? 0 : (page - 1) * maxGamesPerPage)
        .take(maxGamesPerPage)
        .getMany()

      return games
    }

    const orders = {
      releaseDate: 'g.releaseDate'
    }

    return await this.gameRepository
      .createQueryBuilder('g')
      .innerJoinAndSelect('g.platforms', 'p')
      .innerJoinAndSelect('g.genres', 'gr')
      .innerJoinAndSelect('g.ageRating', 'a')
      .where('to_tsvector(g.name) @@ to_tsquery(:query)', { query: term })
      .orWhere('to_tsvector(p.name) @@ to_tsquery(:query)', { query: term })
      .orWhere('to_tsvector(gr.name) @@ to_tsquery(:query)', { query: term })
      .orderBy(`${orders[sortType]}`, sortOrder)
      .skip(page < 2 ? 0 : (page - 1) * maxGamesPerPage)
      .take(maxGamesPerPage)
      .getMany()
  }

  async getMaxPagesBySearch(term: string): Promise<number> {
    term = `+${term}`

    const games = await this.gameRepository
      .createQueryBuilder('g')
      .innerJoinAndSelect('g.platforms', 'p')
      .innerJoinAndSelect('g.genres', 'gr')
      .innerJoinAndSelect('g.ageRating', 'a')
      .where('to_tsvector(g.name) @@ to_tsquery(:query)', { query: term })
      .orWhere('to_tsvector(p.name) @@ to_tsquery(:query)', { query: term })
      .orWhere('to_tsvector(gr.name) @@ to_tsquery(:query)', { query: term })
      .getMany()

    return Math.ceil(games.length / maxGamesPerPage)
  }

  async getMaxPages(): Promise<number> {
    const count = await this.gameRepository.count()

    return Math.ceil(count / maxGamesPerPage)
  }

  async createReview(review: Review): Promise<void> {
    const game = await this.gameRepository.findOne({ where: { id: review.game.id } })
    const reviewer = await this.reviewerRepository.findOne({ where: { id: review.reviewer.id } })

    if (game != null && reviewer != null) {
      review.game = game
      review.reviewer = reviewer
      await this.reviewRepository.save(review)
    }
  }

  async verifyGameAlreadyExists(id: string): Promise<boolean> {
    const game = await this.gameRepository.findOne({ where: { id } })

    return game != null
  }

  async updateReview(review: Review): Promise<void> {
    await this.reviewRepository.save(review)
  }

  async checkReviewExists(id: string): Promise<boolean> {
    const review = await this.reviewRepository.findOne({ where: { id } })

    return review != null
  }

  async getUserForReview(id: string): Promise<string> {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: { reviewer: true } })

    if (review == null) return ''

    return review.reviewer.id
  }

  async checkReviewerHasReviewByGame(reviewerId: string, gameId: string): Promise<boolean> {
    const review = await this.reviewRepository.findOne({
      where: { game: { id: gameId }, reviewer: { id: reviewerId } }
    })

    return review != null
  }

  async getReviewsByGame(gameId: string): Promise<Review[]> {
    const reviews = await this.reviewRepository.find({ where: { game: { id: gameId } }, relations: { reviewer: true } })

    if (reviews === undefined) return []

    return reviews.map((x) => {
      const owner = new Owner()
      owner.id = x.reviewer.id
      owner.username = x.reviewer.username

      x.setOwner(owner)

      return x
    })
  }

  private async paginateInMemory(page: number, games: Game[]): Promise<Game[]> {
    const arr = []

    const forCondition = games.length > maxGamesPerPage ? maxGamesPerPage : games.length

    for (let index = page < 2 ? 0 : (page - 1) * maxGamesPerPage; index < forCondition; index++) {
      const element = games[index]

      const game = await this.gameRepository.findOne({
        where: { id: element.id },
        relations: {
          ageRating: true,
          platforms: true,
          genres: true
        }
      })

      if (game != null) {
        arr.push(game)
      }
    }

    return arr
  }
}
