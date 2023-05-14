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
})
