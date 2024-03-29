import { minPages } from '../constants'

export class GamesQueryStringDTO {
  private page: number
  private readonly sort: string
  private readonly sortType: 'releaseDate'
  private readonly sortOrder: 'ASC' | 'DESC'
  private readonly term: string

  constructor(page: string | undefined, sort: string | undefined, term: string | undefined) {
    this.page = page !== undefined && Number(page) > 0 ? Number(page) : minPages
    this.sort =
      sort !== undefined && ['asc(releaseDate)', 'desc(releaseDate)'].includes(String(sort))
        ? String(sort)
        : 'desc(releaseDate)'
    this.sortType = 'releaseDate'
    this.sortOrder = this.sort.includes('asc') ? 'ASC' : 'DESC'
    this.term = term !== undefined && term.trim().length > 0 ? term.trim() : ''
  }

  getTerm(): string {
    return this.term
  }

  getPage(): number {
    return this.page
  }

  getSortType(): 'releaseDate' {
    return this.sortType
  }

  getSortOrder(): 'ASC' | 'DESC' {
    return this.sortOrder
  }

  setPage(page: number): void {
    this.page = page
  }
}
