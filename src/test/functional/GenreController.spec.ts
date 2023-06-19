import { AgeRating, Game, Genre, Platform } from '$/domain/entities'
import { AppDataSource } from '$/infrastructure/AppDataSource'
import { RedisClient } from '$/infrastructure/RedisClient'
import { GenreRepository, PlatformRepository } from '$/infrastructure/repositories'
import { GameRepository } from '$/infrastructure/repositories/GameRepository'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import app from '$/infrastructure/server'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { performance } from 'perf_hooks'

chai.use(chaiHttp)

const clearData = async (): Promise<void> => {
  const gamesRepository = AppDataSource.getRepository(Game)
  const genresRepository = AppDataSource.getRepository(Genre)
  const platformsRepository = AppDataSource.getRepository(Platform)

  await Promise.all([
    genresRepository.createQueryBuilder().delete(),
    platformsRepository.createQueryBuilder().delete(),
    gamesRepository.createQueryBuilder().delete()
  ])

  const redisClient = await RedisClient.getClient()

  await redisClient.del('genres')
}

describe('POST /api/v1/genres', () => {
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
    const firstResponse = await chai.request(app).post(apiRoutes.genres.create).send({
      name: 'action'
    })

    chai.expect(firstResponse).to.have.status(201)

    const secondResponse = await chai.request(app).post(apiRoutes.genres.create).send({
      name: 'action'
    })

    chai.expect(secondResponse).to.have.status(400)
    chai.expect(secondResponse.body.success).to.be.false
    chai.expect(secondResponse.body.errors).to.have.length(1)
    chai.expect(secondResponse.body.errors[0]).to.be.equal('Esse gênero já existe.')
    chai.expect(secondResponse.body.data).to.have.length(0)
  })

  it('should create a genre', async () => {
    const response = await chai.request(app).post(apiRoutes.genres.create).send({
      name: 'action'
    })

    chai.expect(response).to.have.status(201)
    chai.expect(response.body.success).to.be.true
    chai.expect(response.body.errors).to.have.length(0)
    chai.expect(response.body.data).to.have.length(1)
    chai.expect(response.body.data[0].name).to.be.equal('action')
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
    const response = await chai.request(app).post(apiRoutes.genres.create).send({ name: 'action' })

    const genreId = response.body.data[0].id as string

    const deleteResponse = await chai.request(app).delete(apiRoutes.genres.deleteById.replace(':id', genreId))

    chai.expect(deleteResponse).to.have.status(204)

    const allGenresResponse = await chai.request(app).get(apiRoutes.genres.getAll)

    chai.expect(allGenresResponse.body.data).to.have.length(0)
  })
})

describe('DELETE /api/v1/genres/:id 2', () => {
  beforeEach(async () => {
    const allAges = await chai.request(app).get(apiRoutes.ageRatings.getAll)
    const genreRepository = new GenreRepository()
    const platformRepository = new PlatformRepository()
    const gameRepository = new GameRepository()

    const age = new AgeRating()
    age.age = allAges.body.data[0].age as string
    age.description = allAges.body.data[0].description as string
    age.id = allAges.body.data[0].id

    const genre = new Genre()
    genre.name = 'multiplayer'
    genre.id = 'genreb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a'

    const platform = new Platform()
    platform.name = 'platform_x'
    platform.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

    const game = new Game()
    game.name = 'The Witcher 3'
    game.price = 100
    game.description =
      'O jogo mais premiado de uma geração agora aprimorado para a atual! Experimente The Witcher 3: Wild Hunt e suas expansões nesta coleção definitiva, com melhor desempenho, visuais aprimorados, novo conteúdo adicional, modo fotografia e muito mais!'
    game.releaseDate = new Date()
    game.ageRating = age

    game.addGenre(genre)
    game.addPlatform(platform)
    game.id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

    await Promise.all([
      genreRepository.createGenre(genre),
      platformRepository.create(platform),
      gameRepository.create(game)
    ])
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return conflict when genre has related games', async () => {
    const response = await chai
      .request(app)
      .delete(apiRoutes.genres.deleteById.replace(':id', '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'))

    chai.expect(response).to.have.status(409)
  })
})
