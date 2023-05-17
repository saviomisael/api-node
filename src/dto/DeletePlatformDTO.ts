import { MinLength } from 'class-validator'

export class DeletePlatformDTO {
  @MinLength(36, {
    message: 'Id must have 36 characters.'
  })
    id: string

  constructor (id: string) {
    this.id = id
  }
}
