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
})
