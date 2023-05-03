import chai from 'chai'
import chaiHttp from 'chai-http'
import { DBConnection } from '../../data/DBConnection'
import app from '../../server'

chai.use(chaiHttp)

describe('POST /api/v1/genres', () => {
  afterEach(async () => {
    const connection = await DBConnection.getConnection()

    await connection.execute('DELETE FROM genres')
  })

  it('should return a bad request response when name is not provided', async () => {
    const response = await chai.request(app)
      .post('/api/v1/genres')
      .send({})

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.errors).to.have.length(2)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.false
  })

  it('should return a bad request when genre already exists.', async () => {
    const firstResponse = await chai.request(app).post('/api/v1/genres').send({
      name: 'action'
    })

    chai.expect(firstResponse).to.have.status(201)

    const secondResponse = await chai.request(app).post('/api/v1/genres').send({
      name: 'action'
    })

    chai.expect(secondResponse).to.have.status(400)
    chai.expect(secondResponse.body.success).to.be.false
    chai.expect(secondResponse.body.errors).to.have.length(1)
    chai.expect(secondResponse.body.errors[0]).to.be.equal('This genre already exists.')
    chai.expect(secondResponse.body.data).to.have.length(0)
  })

  it('should create a genre', async () => {
    const response = await chai.request(app).post('/api/v1/genres').send({
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
    const connection = await DBConnection.getConnection()

    await connection.execute('DELETE FROM genres')
  })

  it('should return an empty array with status 200', async () => {
    const response = await chai.request(app).get('/api/v1/genres')

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.true
    chai.expect(response.body.errors).to.have.length(0)
  })
})
