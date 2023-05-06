import { Length } from 'class-validator'

export class DeleteGenreDTO {
  @Length(32, 32, {
    message: 'Id must have 32 characters.'
  })
    id: string

  constructor (id: string) {
    this.id = id
  }
}
