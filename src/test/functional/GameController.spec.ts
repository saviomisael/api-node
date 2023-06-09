import { DBConnection } from '$/infrastructure/DBConnection'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import app from '$/infrastructure/server'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

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
    const conn = await DBConnection.getConnection()

    await Promise.all([
      conn.execute('DELETE FROM games_genres'),
      conn.execute('DELETE FROM games_platforms'),
      conn.execute('DELETE FROM games')
    ])
  })

  it('should create a game succesfully', async () => {
    const requester = chai.request(app).keepOpen()

    const [allAges, allGenres, allPlatforms] = await Promise.all([
      requester.get(apiRoutes.ageRatings.getAll),
      requester.get(apiRoutes.genres.getAll),
      requester.get(apiRoutes.platforms.getAll)
    ])

    const age = allAges.body.data[0].id as string
    const platform1 = allPlatforms.body.data[0].id as string
    const platform2 = allPlatforms.body.data[1].id as string
    const genre1 = allGenres.body.data[0].id as string
    const genre2 = allGenres.body.data[1].id as string

    const gameRequestData = {
      ageRatingId: age,
      description: 'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
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
    const conn = await DBConnection.getConnection()

    await Promise.all([
      conn.execute('DELETE FROM games_genres'),
      conn.execute('DELETE FROM games_platforms'),
      conn.execute('DELETE FROM games')
    ])
  })

  it('should return a bad request when game id provided is not valid', async () => {
    const response = await chai.request(app).get(apiRoutes.games.getById.replace(':id', '123'))

    chai.expect(response).to.have.status(400)
  })

  it('should return not found when game not exists', async () => {
    const response = await chai.request(app).get(apiRoutes.games.getById.replace(':id', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'))

    chai.expect(response).to.have.status(404)
  })
})

describe('GET /api/v1/games/:id 2', () => {
  let gameId: string

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

  beforeEach(async () => {
    const requester = chai.request(app).keepOpen()

    const [allAges, allGenres, allPlatforms] = await Promise.all([
      requester.get(apiRoutes.ageRatings.getAll),
      requester.get(apiRoutes.genres.getAll),
      requester.get(apiRoutes.platforms.getAll)
    ])

    const age = allAges.body.data[0].id as string
    const platform1 = allPlatforms.body.data[0].id as string
    const platform2 = allPlatforms.body.data[1].id as string
    const genre1 = allGenres.body.data[0].id as string
    const genre2 = allGenres.body.data[1].id as string

    const gameRequestData = {
      ageRatingId: age,
      description: 'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!',
      genres: [genre1, genre2],
      platforms: [platform1, platform2],
      name: 'The Witcher 3: Wild Hunt - Complete Edition',
      price: 100,
      releaseDate: '2020-05-14'
    }

    const response = await requester.post(apiRoutes.games.create).send(gameRequestData)
    gameId = response.body.data[0].id
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
    const response = await chai.request(app).get(apiRoutes.games.getById.replace(':id', gameId))

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data).to.have.length(1)
  })
})

describe('PUT /api/v1/games/:id', () => {
  it('should return a bad request when only id is provided', async () => {
    const response = await chai.request(app).put(apiRoutes.games.updateGameById.replace(':id', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'))

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.errors.length > 0).to.be.true
  })
})
