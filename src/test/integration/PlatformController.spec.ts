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

  await connection.execute('DELETE FROM platforms')
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
        .equal('The platform name must have at least 3 characters.')
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
          .replace(':id', response.body.data[0].id)

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
    if (!RedisClient.isOpen) await RedisClient.connect()

    await RedisClient.del('platforms')

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
