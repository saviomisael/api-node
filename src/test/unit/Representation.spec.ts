import chai from 'chai'
import { Representation } from '../../hateoas/Representation'

describe('Representation', () => {
  it('should create a representation with self link', () => {
    const representation = new Representation()
      .addSelfLink('/api/v1/genres')
      .getRepresentation()

    chai.expect(representation.getLinks()).to.have.length(1)
    chai.expect(representation.getLinks()[0].getRel()).to.be.equal('self')
    chai.expect(representation.getLinks()[0].getHref())
      .to
      .be
      .equal('/api/v1/genres')
  })

  it('should add a custom link', () => {
    const representation = new Representation()
      .addLink('list', '/api/v1/genres')
      .getRepresentation()

    chai.expect(representation.getLinks()).to.have.length(1)
    chai.expect(representation.getLinks()[0].getRel()).to.be.equal('list')
    chai.expect(representation.getLinks()[0].getHref())
      .to
      .be
      .equal('/api/v1/genres')
  })
})
