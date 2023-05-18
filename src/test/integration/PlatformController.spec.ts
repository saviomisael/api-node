import chai from 'chai'
import chaiHttp from 'chai-http'
import { DBConnection } from '../../data/DBConnection'
import { apiRoutes } from '../../routes/apiRoutes'
import app from '../../server'

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
})
