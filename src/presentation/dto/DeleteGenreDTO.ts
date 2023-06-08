import { Length } from 'class-validator'

export class DeleteGenreDTO {
  @Length(36, 36, {
    message: 'O id precisa ter 36 caracteres.'
  })
    id: string

  constructor (id: string) {
    this.id = id
  }
}
