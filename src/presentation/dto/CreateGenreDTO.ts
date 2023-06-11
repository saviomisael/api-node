import { IsNotEmpty, MinLength } from 'class-validator'

export class CreateGenreDTO {
  @IsNotEmpty({
    message: 'O nome do gênero nao pode estar vazio.'
  })
  @MinLength(2, {
    message: 'O nome do gênero deve ter pelo menos dois caracteres.'
  })
  name!: string

  constructor(name: string) {
    this.name = name
  }
}
