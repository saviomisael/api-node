import { MinLength } from 'class-validator'

export class CreatePlatformDTO {
  @MinLength(3, {
    message: 'The platform name must have at least 3 characters.'
  })
    name: string

  constructor (name: string) {
    this.name = name
  }
}
