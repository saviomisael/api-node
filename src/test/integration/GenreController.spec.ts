import chai from 'chai'
import chaiHttp from 'chai-http'
import { DBConnection } from '../../data/DBConnection'
import { apiRoutes } from '../../routes/apiRoutes'
import app from '../../server'

chai.use(chaiHttp)

const clearData = async (): Promise<void> => {
  const connection = await DBConnection.getConnection()

  await connection.execute('DELETE FROM genres')
}

describe('POST /api/v1/genres', () => {
  afterEach(async () => {
    await clearData()
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
    await clearData()
  })

  it('should return an empty array with status 200', async () => {
    const response = await chai.request(app).get('/api/v1/genres')

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.success).to.be.true
    chai.expect(response.body.errors).to.have.length(0)
  })

  it('should return an genre array with status 200', async () => {
    await chai.request(app).post('/api/v1/genres').send({ name: 'action' })
    await chai.request(app).post('/api/v1/genres').send({ name: 'drama' })

    const response = await chai.request(app).get('/api/v1/genres')

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.success).to.be.true
    chai.expect(response.body.errors).to.have.length(0)
    chai.expect(response.body.data).to.have.length(2)
    chai.expect(response.body.data[0].name).to.be.equal('action')
    chai.expect(response.body.data[1].name).to.be.equal('drama')
  })
})

describe('DELETE /api/v1/genres/:id', () => {
  afterEach(async () => {
    await clearData()
  })

  it('should not delete genre when genre id does not have 32 characters.', async () => {
    const response = await chai.request(app).delete('/api/v1/genres/123')

    chai.expect(response).to.have.status(400)
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.errors).to.have.length(1)
    chai.expect(response.body.success).to.be.false
  })

  it('should not delete genre when genre not exists.', async () => {
    const response = await chai.request(app).delete('/api/v1/genres/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')

    chai.expect(response).to.have.status(404)
    chai.expect(response.body.success).to.be.false
    chai.expect(response.body.data).to.have.length(0)
    chai.expect(response.body.errors).to.have.length(1)
    chai.expect(response.body.errors[0]).to.be.equal('The genre not exists.')
  })

  it('should delete genre', async () => {
    const response = await chai.request(app).post('/api/v1/genres').send({ name: 'action' })

    const genreId = response.body.data[0].id as string

    const deleteResponse = await chai.request(app).delete(`/api/v1/genres/${genreId}`)

    chai.expect(deleteResponse).to.have.status(204)

    const allGenresResponse = await chai.request(app).get(apiRoutes.genres.getAll)

    chai.expect(allGenresResponse.body.data).to.have.length(0)
  })
})
