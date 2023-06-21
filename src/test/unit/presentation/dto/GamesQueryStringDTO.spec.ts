import { GamesQueryStringDTO } from '$/presentation/dto'
import chai from 'chai'

describe('GamesQueryStringDTO', () => {
  it('should return a dto with default values', () => {
    const dto = new GamesQueryStringDTO(undefined, undefined, undefined)

    chai.expect(dto.getPage()).to.be.eq(1)
    chai.expect(dto.getSortOrder()).to.be.equal('DESC')
    chai.expect(dto.getSortType()).to.be.equal('releaseDate')
    chai.expect(dto.getTerm()).to.be.equal('')
  })

  it('should return page equals to page provided', () => {
    const dto = new GamesQueryStringDTO('2', undefined, undefined)

    chai.expect(dto.getPage()).to.be.eq(2)
    chai.expect(dto.getSortOrder()).to.be.equal('DESC')
    chai.expect(dto.getSortType()).to.be.equal('releaseDate')
    chai.expect(dto.getTerm()).to.be.equal('')
  })

  it('should return reviewsCount in ascending order', () => {
    const dto = new GamesQueryStringDTO('2', 'asc(reviewsCount)', undefined)

    chai.expect(dto.getPage()).to.be.eq(2)
    chai.expect(dto.getSortOrder()).to.be.equal('ASC')
    chai.expect(dto.getSortType()).to.be.equal('reviewsCount')
    chai.expect(dto.getTerm()).to.be.equal('')
  })

  it('should return reviewsCount in descending order', () => {
    const dto = new GamesQueryStringDTO('2', 'desc(reviewsCount)', undefined)

    chai.expect(dto.getPage()).to.be.eq(2)
    chai.expect(dto.getSortOrder()).to.be.equal('DESC')
    chai.expect(dto.getSortType()).to.be.equal('reviewsCount')
    chai.expect(dto.getTerm()).to.be.equal('')
  })
})
