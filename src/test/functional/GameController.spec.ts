import { AgeRating, Game, Genre, Platform } from '$/domain/entities'
import { DBConnection } from '$/infrastructure/DBConnection'
import { GenreRepository, PlatformRepository } from '$/infrastructure/repositories'
import { GameRepository } from '$/infrastructure/repositories/GameRepository'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import app from '$/infrastructure/server'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

const clearData = async (): Promise<void> => {
  const conn = await DBConnection.getConnection()

  await Promise.all([
    conn.execute('DELETE FROM games_genres'),
    conn.execute('DELETE FROM games_platforms'),
    conn.execute('DELETE FROM games'),
    conn.execute('DELETE FROM genres'),
    conn.execute('DELETE FROM platforms')
  ])
}

describe('POST /api/v1/games', () => {
  it('should return a bad request when genres has duplicates', async () => {
    const requestData = {
      ageRatingId: '123',
      description: '123',
      genres: ['123', '123'],
      platforms: ['123', '123'],
      name: 'game',
      price: 0,
      releaseDate: '2020-01-01'
    }
    const response = await chai.request(app).post(apiRoutes.games.create).send(requestData)

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.false
    chai.expect(response.body.errors).to.have.length(1)
  })

  it('should return a bad request when platforms has duplicates', async () => {
    const requestData = {
      ageRatingId: '123',
      description: '123',
      genres: ['123', '1234'],
      platforms: ['123', '123'],
      name: 'game',
      price: 0,
      releaseDate: '2020-01-01'
    }
    const response = await chai.request(app).post(apiRoutes.games.create).send(requestData)

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.false
    chai.expect(response.body.errors).to.have.length(1)
  })

  it('should return a bad request when dto is not valid', async () => {
    const requestData = {
      ageRatingId: '123',
      description: '123',
      genres: ['123', '1234'],
      platforms: ['123', '1234'],
      name: 'ab',
      price: -1,
      releaseDate: '01/01/2020'
    }
    const response = await chai.request(app).post(apiRoutes.games.create).send(requestData)

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.false
    chai.expect(response.body.errors.length > 0).to.have.true
  })
})

describe('POST /api/v1/games 2', () => {
  beforeEach(async () => {
    const genreRepository = new GenreRepository()
    const platformRepository = new PlatformRepository()

    const genre1 = new Genre('action 1')
    genre1.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const genre2 = new Genre('action 2')
    genre2.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'

    const platform1 = new Platform('playstation 1')
    platform1.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const platform2 = new Platform('playstation 2')
    platform2.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'

    const pipeline = [
      genreRepository.createGenre(genre1),
      genreRepository.createGenre(genre2),
      platformRepository.create(platform1),
      platformRepository.create(platform2)
    ]

    await Promise.all([...pipeline])
  })

  afterEach(async () => {
    await clearData()
  })

  it('should create a game succesfully', async () => {
    const requester = chai.request(app).keepOpen()

    const allAges = await requester.get(apiRoutes.ageRatings.getAll)

    const age = allAges.body.data[0].id as string
    const platform1 = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const platform2 = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'
    const genre1 = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const genre2 = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'

    const gameRequestData = {
      ageRatingId: age,
      description:
        'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      genres: [genre1, genre2],
      platforms: [platform1, platform2],
      name: 'The Witcher 3: Wild Hunt - Complete Edition',
      price: 100,
      releaseDate: '2020-05-14'
    }

    const response = await requester.post(apiRoutes.games.create).send(gameRequestData)

    chai.expect(response).to.have.status(201)
    chai.expect(response.body.data[0].platforms).to.have.length(2)
    chai.expect(response.body.data[0].genres).to.have.length(2)
  })
})

describe('GET /api/v1/games/:id', () => {
  beforeEach(async () => {
    const requester = chai.request(app).keepOpen()

    await requester.post(apiRoutes.platforms.create).send({ name: 'platform_x' })
    await requester.post(apiRoutes.platforms.create).send({ name: 'platform_y' })
    await Promise.all([
      requester.post(apiRoutes.platforms.create).send({ name: 'platform_x' }),
      requester.post(apiRoutes.platforms.create).send({ name: 'platform_y' }),
      requester.post(apiRoutes.genres.create).send({ name: 'genre_x' }),
      requester.post(apiRoutes.genres.create).send({ name: 'genre_y' })
    ])
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return a bad request when game id provided is not valid', async () => {
    const response = await chai.request(app).get(apiRoutes.games.getById.replace(':id', '123'))

    chai.expect(response).to.have.status(400)
  })

  it('should return not found when game not exists', async () => {
    const response = await chai
      .request(app)
      .get(apiRoutes.games.getById.replace(':id', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'))

    chai.expect(response).to.have.status(404)
  })
})

describe('GET /api/v1/games/:id 2', () => {
  beforeEach(async () => {
    const allAges = await chai.request(app).get(apiRoutes.ageRatings.getAll)
    const genreRepository = new GenreRepository()
    const platformRepository = new PlatformRepository()
    const gameRepository = new GameRepository()

    const age = new AgeRating(allAges.body.data[0].age as string, allAges.body.data[0].description as string)
    age.id = allAges.body.data[0].id

    const genre1 = new Genre('action 1')
    genre1.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const genre2 = new Genre('action 2')
    genre2.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'

    const platform1 = new Platform('playstation 1')
    platform1.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const platform2 = new Platform('playstation 2')
    platform2.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'

    const pipeline = [
      genreRepository.createGenre(genre1),
      genreRepository.createGenre(genre2),
      platformRepository.create(platform1),
      platformRepository.create(platform2)
    ]

    const game = new Game(
      'The Witcher 3',
      100,
      'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      new Date(),
      age
    )
    game.addGenre(genre1)
    game.addGenre(genre2)
    game.addPlatform(platform1)
    game.addPlatform(platform2)
    game.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    pipeline.push(gameRepository.create(game))

    await Promise.all([...pipeline])
  })

  afterEach(async () => {
    const conn = await DBConnection.getConnection()

    await Promise.all([
      conn.execute('DELETE FROM games_genres'),
      conn.execute('DELETE FROM games_platforms'),
      conn.execute('DELETE FROM games')
    ])
  })

  it('should return a game with an ok status code', async () => {
    const response = await chai
      .request(app)
      .get(apiRoutes.games.getById.replace(':id', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'))

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data).to.have.length(1)
  })
})

describe('PUT /api/v1/games/:id', () => {
  it('should return not found when only id is provided', async () => {
    const response = await chai
      .request(app)
      .put(apiRoutes.games.updateGameById.replace(':id', '9b1deb4d-aaaa-aaaa-aaaa-2b0d7b3dcb6d'))

    chai.expect(response).to.have.status(404)
    chai.expect(response.body.errors.length > 0).to.be.true
  })

  it('should return not found when age rating not exists', async () => {
    const gameMock = {
      ageRatingId: '8904dc7d-acc7-4106-9ff6-367090fe2e48',
      description:
        'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      genres: ['8904dc7d-acc7-4106-9ff6-367090fe2e48'],
      name: 'The Witcher 3',
      platforms: ['8904dc7d-acc7-4106-9ff6-367090fe2e48'],
      price: 100,
      releaseDate: '2020-05-14'
    }

    const response = await chai
      .request(app)
      .put(apiRoutes.games.updateGameById.replace(':id', '8904dc7d-acc7-4106-9ff6-367090fe2e48'))
      .send(gameMock)

    chai.expect(response).to.have.status(404)
  })
})

describe('PUT /api/v1/games/:id 2', () => {
  beforeEach(async () => {
    const allAges = await chai.request(app).get(apiRoutes.ageRatings.getAll)
    const genreRepository = new GenreRepository()
    const platformRepository = new PlatformRepository()
    const gameRepository = new GameRepository()

    const age = new AgeRating(allAges.body.data[0].age as string, allAges.body.data[0].description as string)
    age.id = allAges.body.data[0].id

    const genre1 = new Genre('action 4')
    genre1.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'
    const genre2 = new Genre('action 5')
    genre2.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6b'

    const platform1 = new Platform('playstation 5')
    platform1.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'
    const platform2 = new Platform('playstation 6')
    platform2.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6b'

    const pipeline = [
      genreRepository.createGenre(genre1),
      genreRepository.createGenre(genre2),
      platformRepository.create(platform1),
      platformRepository.create(platform2)
    ]

    const game = new Game(
      'The Witcher 3',
      100,
      'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      new Date(),
      age
    )
    game.addGenre(genre1)
    game.addGenre(genre2)
    game.addPlatform(platform1)
    game.addPlatform(platform2)
    game.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'
    pipeline.push(gameRepository.create(game))

    await Promise.all([...pipeline])
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return bad request when genres property has duplicates', async () => {
    const gameMock = {
      ageRatingId: '8904dc7d-acc7-4106-9ff6-367090fe2e48',
      description:
        'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      genres: ['8904dc7d-acc7-4106-9ff6-367090fe2e48', '8904dc7d-acc7-4106-9ff6-367090fe2e48'],
      name: 'The Witcher 3',
      platforms: ['8904dc7d-acc7-4106-9ff6-367090fe2e48'],
      price: 100,
      releaseDate: '2020-05-14'
    }

    const response = await chai
      .request(app)
      .put(apiRoutes.games.updateGameById.replace(':id', '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'))
      .send(gameMock)

    chai.expect(response).to.have.status(400)
  })

  it('should return bad request when platforms property has duplicates', async () => {
    const gameMock = {
      ageRatingId: '8904dc7d-acc7-4106-9ff6-367090fe2e48',
      description:
        'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      genres: ['8904dc7d-acc7-4106-9ff6-367090fe2e48'],
      name: 'The Witcher 3',
      platforms: ['8904dc7d-acc7-4106-9ff6-367090fe2e48', '8904dc7d-acc7-4106-9ff6-367090fe2e48'],
      price: 100,
      releaseDate: '2020-05-14'
    }

    const response = await chai
      .request(app)
      .put(apiRoutes.games.updateGameById.replace(':id', '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'))
      .send(gameMock)

    chai.expect(response).to.have.status(400)
  })

  it('should update a game successfully', async () => {
    const requester = chai.request(app).keepOpen()

    const allAges = await requester.get(apiRoutes.ageRatings.getAll)

    const age = allAges.body.data[1]
    const platform1 = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'
    const genre1 = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'

    const gameMock = {
      ageRatingId: age.id,
      description:
        'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      genres: [genre1],
      platforms: [platform1],
      name: 'The Witcher 3: Wild Hunt - Complete Edition',
      price: 100,
      releaseDate: '2020-05-14'
    }

    const response = await requester
      .put(apiRoutes.games.updateGameById.replace(':id', '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'))
      .send(gameMock)

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data[0].platforms).to.have.length(1)
    chai.expect(response.body.data[0].genres).to.have.length(1)
    chai.expect(response.body.data[0].ageRating.name).to.be.equal(age.name)
  })
})

describe('DELETE /api/v1/games/:id', () => {
  it('should return bad request when id is not valid', async () => {
    const response = await chai.request(app).delete(apiRoutes.games.deleteById.replace(':id', '123'))

    chai.expect(response).to.have.status(400)
  })

  it('should return not found when game not exists', async () => {
    const response = await chai
      .request(app)
      .delete(apiRoutes.games.deleteById.replace(':id', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'))

    chai.expect(response).to.have.status(404)
  })
})

describe('DELETE /api/v1/games/:id 2', () => {
  beforeEach(async () => {
    const allAges = await chai.request(app).get(apiRoutes.ageRatings.getAll)
    const genreRepository = new GenreRepository()
    const platformRepository = new PlatformRepository()
    const gameRepository = new GameRepository()

    const age = new AgeRating(allAges.body.data[0].age as string, allAges.body.data[0].description as string)
    age.id = allAges.body.data[0].id

    const genre1 = new Genre('action 4')
    genre1.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'
    const genre2 = new Genre('action 5')
    genre2.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6b'

    const platform1 = new Platform('playstation 5')
    platform1.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'
    const platform2 = new Platform('playstation 6')
    platform2.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6b'

    const pipeline = [
      genreRepository.createGenre(genre1),
      genreRepository.createGenre(genre2),
      platformRepository.create(platform1),
      platformRepository.create(platform2)
    ]

    const game = new Game(
      'The Witcher 3',
      100,
      'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      new Date(),
      age
    )
    game.addGenre(genre1)
    game.addGenre(genre2)
    game.addPlatform(platform1)
    game.addPlatform(platform2)
    game.id = '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'
    pipeline.push(gameRepository.create(game))

    await Promise.all([...pipeline])
  })

  afterEach(async () => {
    await clearData()
  })

  it('should delete a game succesfully', async () => {
    const response = await chai
      .request(app)
      .delete(apiRoutes.games.deleteById.replace(':id', '9b1deb4d-3b7d-4baa-9bdd-2b0d7b3dcb6a'))

    chai.expect(response).to.have.status(204)
  })
})

describe('GET /api/v1/games', () => {
  it('should return previousPage null', async () => {
    const response = await chai.request(app).get(apiRoutes.games.getAll)

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data[0].previousPage).to.be.null
  })

  it('should return nextPage null', async () => {
    const response = await chai.request(app).get(apiRoutes.games.getAll)

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data[0].nextPage).to.be.null
  })

  it('should return currentPage equal 1 when page is not provided', async () => {
    const response = await chai.request(app).get(apiRoutes.games.getAll)

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data[0].currentPage).to.be.equal(1)
  })

  it('should return the first page when page provided is greater than max pages', async () => {
    const response = await chai.request(app).get(apiRoutes.games.getAll + '?page=10')

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data[0].currentPage).to.be.equal(1)
  })
})

describe('GET /api/v1/games 2', () => {
  beforeEach(async () => {
    const allAges = await chai.request(app).get(apiRoutes.ageRatings.getAll)
    const genreRepository = new GenreRepository()
    const platformRepository = new PlatformRepository()
    const gameRepository = new GameRepository()

    const age = new AgeRating(allAges.body.data[0].age as string, allAges.body.data[0].description as string)
    age.id = allAges.body.data[0].id

    const genre1 = new Genre('action 1')
    genre1.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const genre2 = new Genre('action 2')
    genre2.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'

    const platform1 = new Platform('playstation 1')
    platform1.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    const platform2 = new Platform('playstation 2')
    platform2.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b'

    const pipeline = [
      genreRepository.createGenre(genre1),
      genreRepository.createGenre(genre2),
      platformRepository.create(platform1),
      platformRepository.create(platform2)
    ]

    const lastCharacters = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z'
    ]

    for (let index = 0; index < lastCharacters.length; index++) {
      const letter = lastCharacters[index]

      const game = new Game(
        'The Witcher 3',
        100,
        'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
        new Date(2020, 5, index + 1),
        age
      )

      const genre = index % 2 === 0 ? genre1 : genre2

      game.addGenre(genre)
      game.addPlatform(platform1)
      game.addPlatform(platform2)
      game.id = `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6${letter}`
      pipeline.push(gameRepository.create(game))
    }

    await Promise.all([...pipeline])
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return games sorted by default values', async () => {
    const response = await chai.request(app).get(apiRoutes.games.getAll)

    const games = response.body.data[0].games
    const firstGame = games.at(0)
    const lastGame = games.at(games.length - 1)

    chai.expect(games).to.have.length(9)
    chai
      .expect(new Date(firstGame.releaseDate as string).toISOString())
      .to.be.equal(new Date(2020, 5, 26).toISOString())
    chai.expect(new Date(lastGame.releaseDate as string).toISOString()).to.be.equal(new Date(2020, 5, 18).toISOString())
  })
})
