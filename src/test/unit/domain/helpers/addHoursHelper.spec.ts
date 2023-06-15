import { addHoursHelper } from '$/domain/helpers/addHoursHelper'
import chai from 'chai'

describe('addHoursHelper', () => {
  it('should add 1 hour to a date', () => {
    const date = new Date(2020, 0, 1, 10, 30, 30)
    const dateAfter1Hour = addHoursHelper(date, 1)

    chai.expect(date.getFullYear()).to.be.equal(dateAfter1Hour.getFullYear())
    chai.expect(date.getMonth()).to.be.equal(dateAfter1Hour.getMonth())
    chai.expect(date.getDate()).to.be.equal(dateAfter1Hour.getDate())
    chai.expect(date.getHours() + 1).to.be.equal(dateAfter1Hour.getHours())
    chai.expect(date.getMinutes()).to.be.equal(dateAfter1Hour.getMinutes())
    chai.expect(date.getSeconds()).to.be.equal(dateAfter1Hour.getSeconds())
    chai.expect(date.getMilliseconds()).to.be.equal(dateAfter1Hour.getMilliseconds())
  })

  it('should return 1 hour a.m. when old date is 12 p.m.', () => {
    const date = new Date(2020, 0, 1, 24, 30, 30)
    const dateAfter1Hour = addHoursHelper(date, 1)

    chai.expect(date.getFullYear()).to.be.equal(dateAfter1Hour.getFullYear())
    chai.expect(date.getMonth()).to.be.equal(dateAfter1Hour.getMonth())
    chai.expect(date.getDate()).to.be.equal(dateAfter1Hour.getDate())
    chai.expect(date.getHours() + 1).to.be.equal(dateAfter1Hour.getHours())
    chai.expect(date.getMinutes()).to.be.equal(dateAfter1Hour.getMinutes())
    chai.expect(date.getSeconds()).to.be.equal(dateAfter1Hour.getSeconds())
    chai.expect(date.getMilliseconds()).to.be.equal(dateAfter1Hour.getMilliseconds())
  })
})
