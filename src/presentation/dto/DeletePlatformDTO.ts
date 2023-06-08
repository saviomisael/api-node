import { MinLength } from 'class-validator'

export class DeletePlatformDTO {
  @MinLength(36, {
    message: 'O id precisa ter 36 caracteres.'
  })
    id: string

  constructor (id: string) {
    this.id = id
  }
}
