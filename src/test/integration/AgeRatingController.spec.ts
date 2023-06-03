import { AgeRating } from '$/domain/entities'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import app from '$/infrastructure/server'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { performance } from 'perf_hooks'

chai.use(chaiHttp)

describe('GET /api/v1/age-ratings', () => {
  it('should return all age ratings seeded in database', async () => {
    const response = await chai.request(app).get(apiRoutes.ageRatings.getAll)

    const parsedJSON = response.body.data.map((x: any) => {
      x = new AgeRating(x.age, x.description)
      x.setId(x.id)

      return x
    })

    chai.expect(response).to.have.status(200)
    chai.expect(response.body.success).to.be.true
    chai.expect(response.body.errors).to.have.length(0)

    chai.expect(parsedJSON
      .some((x: AgeRating) => x.getAge() === 'L')).to.be.true

    chai.expect(parsedJSON
      .some((x: AgeRating) => x.getAge() === '10+')).to.be.true

    chai.expect(parsedJSON
      .some((x: AgeRating) => x.getAge() === '12+')).to.be.true

    chai.expect(parsedJSON
      .some((x: AgeRating) => x.getAge() === '14+')).to.be.true

    chai.expect(parsedJSON
      .some((x: AgeRating) => x.getAge() === '16+')).to.be.true

    chai.expect(parsedJSON
      .some((x: AgeRating) => x.getAge() === '18+')).to.be.true
  })

  it('should return all age ratings from cache in less time', async () => {
    const firstRequestStartTime = performance.now()

    await chai.request(app).get(apiRoutes.ageRatings.getAll)

    const firstRequestEndTime = performance.now()

    const secondRequestStartTime = performance.now()

    await chai.request(app).get(apiRoutes.ageRatings.getAll)

    const secondRequestEndTime = performance.now()

    const firstDiff = firstRequestEndTime - firstRequestStartTime

    const secondDiff = secondRequestEndTime - secondRequestStartTime

    chai.expect(firstDiff > secondDiff).to.be.true
  })
})
