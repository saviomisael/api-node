import { DBConnection } from '$/infrastructure/DBConnection'
import { RedisClient } from '$/infrastructure/RedisClient'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import app from '$/infrastructure/server'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { performance } from 'perf_hooks'

chai.use(chaiHttp)

const clearData = async (): Promise<void> => {
  const connection = await DBConnection.getConnection()

  await Promise.all([
    connection.execute('DELETE FROM games_platforms'),
    connection.execute('DELETE FROM games_genres'),
    connection.execute('DELETE FROM platforms'),
    connection.execute('DELETE FROM genres'),
    connection.execute('DELETE FROM games')
  ])

  if (!RedisClient.isOpen) await RedisClient.connect()

  await RedisClient.del('platforms')
}

describe('POST /api/v1/platforms', () => {
  afterEach(async () => {
    await clearData()
  })

  it(
    'should return bad request when platform name have less then 3 characters.',
    async () => {
      const response = await chai
        .request(app)
        .post(apiRoutes.platforms.create)
        .send({ name: 'ab' })

      chai.expect(response).to.have.status(400)
      chai.expect(response.body.errors).to.have.length(1)
      chai.expect(response.body.errors[0]).to
        .be
        .equal('O nome da plataforma deve ter no mínimo 3 caracteres.')
    }
  )

  it('should create a platform', async () => {
    const response = await chai
      .request(app)
      .post(apiRoutes.platforms.create)
      .send({ name: 'Xbox Series S' })

    chai.expect(response).to.have.status(201)
    chai.expect(response.body.errors).to.have.length(0)
    chai.expect(response.body.success).to.be.true
    chai.expect(response.body.data[0]).to.be.not.null
  })

  it(
    'should return a bad request when platform is already created',
    async () => {
      await chai
        .request(app)
        .post(apiRoutes.platforms.create)
        .send({ name: 'Xbox Series S' })

      const response = await chai
        .request(app)
        .post(apiRoutes.platforms.create)
        .send({ name: 'Xbox Series S' })

      chai.expect(response).to.have.status(400)
      chai.expect(response.body.success).to.be.false
      chai.expect(response.body.errors).to.have.length(1)
    })
})

describe('DELETE /api/v1/platforms/:id', () => {
  afterEach(async () => {
    await clearData()
  })

  it('should not delete platform when id is less then 36 characters',
    async () => {
      const response = await chai
        .request(app)
        .delete(apiRoutes.platforms.delete.replace(':id', 'abc'))

      chai.expect(response).to.have.status(400)
      chai.expect(response.body.errors).to.have.length(1)
      chai.expect(response.body.data).to.have.length(0)
      chai.expect(response.body.success).to.be.false
    })

  it('should return a bad request when platform not exists', async () => {
    const response = await chai
      .request(app)
      .delete(apiRoutes.platforms.delete.replace(':id',
        '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'))

    chai.expect(response).to.have.status(404)
    chai.expect(response.body.errors).to.have.length(1)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.false
  })

  it('should delete a platform', (done) => {
    chai
      .request(app)
      .post(apiRoutes.platforms.create)
      .send({ name: 'Xbox Series S' })
      .then(async response => {
        const deleteRoute = apiRoutes.platforms.delete
          .replace(':id', response.body.data[0].id as string)

        return await chai
          .request(app)
          .delete(deleteRoute)
      })
      .then(deleteResponse => {
        chai.expect(deleteResponse).to.have.status(204)
        done()
      })
      .catch(error => { throw error })
  })
})

describe('DELETE /api/v1/platforms/:id 2', () => {
  let platformId: string

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
    platformId = platform1
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

    await requester.post(apiRoutes.games.create).send(gameRequestData)
  })

  afterEach(async () => {
    await clearData()
  })

  it('should return conflict when platform has related games', async () => {
    const response = await chai.request(app).delete(apiRoutes.platforms.delete.replace(':id', platformId))

    chai.expect(response).to.have.status(409)
  })
})

describe('GET /api/v1/platforms/', () => {
  afterEach(async () => {
    await clearData()
  })

  it('should return a list of platforms', async () => {
    for (const platform of ['Xbox', 'PS5', 'Switch']) {
      await chai
        .request(app)
        .post(apiRoutes.platforms.create)
        .send({ name: platform })
    }

    const response = await chai
      .request(app)
      .get(apiRoutes.platforms.getAll)

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.errors).to.have.length(0)
    chai.expect(response.body.data).to.have.length(3)
    chai.expect(response.body.success).to.be.true
  })

  it('should return a list of platforms from cache in less time', async () => {
    for (let index = 0; index < 10; index++) {
      await chai
        .request(app)
        .post(apiRoutes.platforms.create)
        .send({ name: `platform${index}` })
    }

    const firstRequestStartTime = performance.now()

    await chai.request(app).get(apiRoutes.platforms.getAll)

    const firstRequestEndTime = performance.now()

    const secondRequestStartTime = performance.now()

    await chai.request(app).get(apiRoutes.platforms.getAll)

    const secondRequestEndTime = performance.now()

    const firstDiff = firstRequestEndTime - firstRequestStartTime
    const secondDiff = secondRequestEndTime - secondRequestStartTime

    chai.expect(firstDiff > secondDiff).to.be.true
  })
})
