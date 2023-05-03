import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../../server'

chai.use(chaiHttp)

describe('POST /api/v1/genres', () => {
  it('should returns a bad request response when name is not provided', async () => {
    const response = await chai.request(app)
      .post('/api/v1/genres')
      .send({})

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.errors).to.have.length(2)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.false
  })
})
