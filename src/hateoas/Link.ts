export class Link {
  constructor (private readonly rel: string,
    private readonly href: string) {}

  public getRel (): string {
    return this.rel
  }

  public getHref (): string {
    return this.href
  }
}
