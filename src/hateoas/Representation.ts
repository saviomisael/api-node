import { InvalidRelError } from './InvalidRelError'
import { Link } from './Link'

export class Representation {
  private readonly _links: Link[] = []

  public addSelfLink (selfHref: string): Representation {
    const selfLinkIndex = this._links.findIndex(x => x.getRel() === 'self')

    if (selfLinkIndex === -1) {
      this._links.push(new Link('self', selfHref))
    } else {
      this._links[selfLinkIndex] = new Link('self', selfHref)
    }

    return this
  }

  addLink (rel: string, href: string): Representation {
    if (rel === 'self') throw new InvalidRelError()

    this._links.push(new Link(rel, href))

    return this
  }

  getRepresentation (): Representation {
    return this
  }

  getLinks (): Link[] {
    return [...this._links]
  }
}
