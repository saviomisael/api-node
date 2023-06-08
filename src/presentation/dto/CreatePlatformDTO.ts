import { MinLength } from 'class-validator'

export class CreatePlatformDTO {
  @MinLength(3, {
    message: 'O nome da plataforma deve ter no mínimo 3 caracteres.'
  })
    name: string

  constructor (name: string) {
    this.name = name
  }
}
