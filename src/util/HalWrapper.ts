import hal from 'hal'

export class HalWrapper<T> {
  private readonly resource: any

  constructor (representation: T, selfUri: string) {
    this.resource = hal.Resource(representation, selfUri)
  }

  addLink (rel: string, href: string): HalWrapper<T> {
    this.resource.link(new hal.Link(rel, href))

    return this
  }

  getResource (): any {
    return this.resource.toJSON()
  }
}
