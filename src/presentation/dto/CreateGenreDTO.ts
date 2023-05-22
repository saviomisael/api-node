import { IsNotEmpty, MinLength } from 'class-validator'

export class CreateGenreDTO {
  @IsNotEmpty({
    message: "Genre's name must not be empty."
  })
  @MinLength(2, {
    message: "Genre's name must have at least 2 characters."
  })
    name!: string

  constructor (name: string) {
    this.name = name
  }
}
