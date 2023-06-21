import 'reflect-metadata'

import { Game, Genre, Platform } from '$/domain/entities'
import { AppDataSource } from '$/infrastructure/AppDataSource'
import { RedisClient } from '$/infrastructure/RedisClient'
import { GenreRepository } from '$/infrastructure/repositories'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import app from '$/infrastructure/server'
import chai from 'chai'
import chaiHttp from 'chai-http'
import dotenv from 'dotenv'
import { performance } from 'perf_hooks'

dotenv.config()

chai.use(chaiHttp)

AppDataSource.initialize()
  .then(() => {
    console.log('Data initialized')
  })
  .catch((error) => {
    console.error(error)
    throw error
  })

const clearData = async (): Promise<void> => {
  const gamesRepository = AppDataSource.getRepository(Game)
  const genresRepository = AppDataSource.getRepository(Genre)
  const platformsRepository = AppDataSource.getRepository(Platform)

  await Promise.all([
    genresRepository.createQueryBuilder().delete().execute(),
    platformsRepository.createQueryBuilder().delete().execute(),
    gamesRepository.createQueryBuilder().delete().execute()
  ])

  const redisClient = await RedisClient.getClient()

  await redisClient.del('genres')
}

describe('POST /api/v1/genres', () => {
  beforeEach(async () => {
    await chai.request(app).post(apiRoutes.genres.create).send({
      name: 'action'
    })
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return a bad request response when name is not provided', async () => {
    const response = await chai.request(app).post(apiRoutes.genres.create).send({})

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.errors).to.have.length(2)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.false
  })

  it('should return a bad request when genre already exists.', async () => {
    const response = await chai.request(app).post(apiRoutes.genres.create).send({
      name: 'action'
    })

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.success).to.be.false
    chai.expect(response.body.errors).to.have.length(1)
    chai.expect(response.body.errors[0]).to.be.equal('Esse gênero já existe.')
    chai.expect(response.body.data).to.have.length(0)
  })

  it('should create a genre', async () => {
    const response = await chai.request(app).post(apiRoutes.genres.create).send({
      name: 'action 2'
    })

    chai.expect(response).to.have.status(201)
    chai.expect(response.body.success).to.be.true
    chai.expect(response.body.errors).to.have.length(0)
    chai.expect(response.body.data).to.have.length(1)
    chai.expect(response.body.data[0].name).to.be.equal('action 2')
  })
})

describe('GET /api/v1/genres', () => {
  afterEach(async () => {
    await clearData()
  })

  it('should return an empty array with status 200', async () => {
    const response = await chai.request(app).get(apiRoutes.genres.getAll)

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.true
    chai.expect(response.body.errors).to.have.length(0)
  })

  it('should return a genre array with status 200', async () => {
    await chai.request(app).post(apiRoutes.genres.create).send({ name: 'action' })
    await chai.request(app).post(apiRoutes.genres.create).send({ name: 'drama' })

    const response = await chai.request(app).get(apiRoutes.genres.getAll)

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.success).to.be.true
    chai.expect(response.body.errors).to.have.length(0)
    chai.expect(response.body.data).to.have.length(2)
    chai.expect(response.body.data[0].name).to.be.equal('action')
    chai.expect(response.body.data[1].name).to.be.equal('drama')
  })

  it('should return a genre list from cache in less time', async () => {
    for (let index = 0; index < 10; index++) {
      await chai
        .request(app)
        .post(apiRoutes.genres.create)
        .send({ name: `genre${index}` })
    }

    const firstRequestStartTime = performance.now()

    await chai.request(app).get(apiRoutes.genres.getAll)

    const firstRequestEndTime = performance.now()

    const secondRequestStartTime = performance.now()

    await chai.request(app).get(apiRoutes.genres.getAll)

    const secondRequestEndTime = performance.now()

    const firstDiff = firstRequestEndTime - firstRequestStartTime
    const secondDiff = secondRequestEndTime - secondRequestStartTime

    chai.expect(firstDiff > secondDiff).to.be.true
  })
})

describe('DELETE /api/v1/genres/:id', () => {
  beforeEach(async () => {
    const genreRepository = new GenreRepository()
    const genre = new Genre()
    genre.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'
    genre.name = 'action 2'

    await genreRepository.createGenre(genre)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should not delete genre when genre id does not have 32 characters.', async () => {
    const response = await chai.request(app).delete(apiRoutes.genres.deleteById.replace(':id', '123'))

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.errors).to.have.length(1)
    chai.expect(response.body.success).to.be.false
  })

  it('should not delete genre when genre does not exist.', async () => {
    const response = await chai
      .request(app)
      .delete(apiRoutes.genres.deleteById.replace(':id', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'))

    chai.expect(response).to.have.status(404)
    chai.expect(response.body.success).to.be.false
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.errors).to.have.length(1)
    chai.expect(response.body.errors[0]).to.be.equal('O gênero não existe.')
  })

  it('should delete genre', async () => {
    const deleteResponse = await chai
      .request(app)
      .delete(apiRoutes.genres.deleteById.replace(':id', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'))

    chai.expect(deleteResponse).to.have.status(204)

    const allGenresResponse = await chai.request(app).get(apiRoutes.genres.getAll)

    chai.expect(allGenresResponse.body.data).to.have.length(0)
  })
})

describe('DELETE /api/v1/genres/:id 2', () => {
  let genreId: string
  beforeEach(async () => {
    const requester = chai.request(app).keepOpen()

    const response = await requester.post(apiRoutes.genres.create).send({ name: 'action' })

    genreId = response.body.data[0].id

    const platformResponse = await requester.post(apiRoutes.platforms.create).send({ name: 'xbox' })

    const platformId = platformResponse.body.data[0].id

    const ages = await requester.get(apiRoutes.ageRatings.getAll)

    const firstAge = ages.body.data[0].id

    await requester.post(apiRoutes.games.create).send({
      name: 'The Witcher 3',
      price: 100,
      description: 'Jogo bem legal',
      releaseDate: '2020-02-05',
      ageRatingId: firstAge,
      platforms: [platformId],
      genres: [genreId]
    })
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return conflict when genre has related games', async () => {
    const response = await chai.request(app).delete(apiRoutes.genres.deleteById.replace(':id', genreId))

    chai.expect(response).to.have.status(409)
  })
})
