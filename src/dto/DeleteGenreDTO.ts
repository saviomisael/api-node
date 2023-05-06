import { Length } from 'class-validator'

export class DeleteGenreDTO {
  @Length(36, 36, {
    message: 'Id must have 36 characters.'
  })
    id: string

  constructor (id: string) {
    this.id = id
  }
}
