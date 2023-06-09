import { ArrayMaxSize, ArrayMinSize, IsArray, Matches, Min, MinLength } from 'class-validator'
import { dateRegex, uuidRegex } from '../constants'

export class UpdateGameDTO {
  @MinLength(3, {
    message: 'O jogo deve ter pelo menos 3 caracteres.'
  })
    name!: string

  @Matches(uuidRegex, {
    message: 'O id do jogo deve ser um uuid válido.'
  })
    id!: string

  @Min(0, {
    message: 'O preço do jogo deve ser um valor positivo ou igual a zero.'
  })
    price!: number

  @MinLength(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.'
  })
    description!: string

  @Matches(dateRegex, {
    message: 'A data de lançamento deve ser uma data.'
  })
    releaseDate!: string

  @Matches(uuidRegex, {
    message: 'O id da faixa etária deve ser um uuid válido.'
  })
    ageRatingId!: string

  @IsArray({
    message: 'As plataformas devem ser um array.'
  })
  @ArrayMaxSize(4, {
    message: 'As plataformas podem ser no máximo 4.'
  })
  @ArrayMinSize(1, {
    message: 'Deve ter pelo menos uma plataforma no array.'
  })
  @Matches(uuidRegex, {
    message: 'O id da plataforma deve ser um uuid válido.',
    each: true
  })
    platforms!: string[]

  @IsArray({
    message: 'Os gêneros devem ser um array.'
  })
  @ArrayMaxSize(4, {
    message: 'Os gêneros podem ser no máximo 4.'
  })
  @ArrayMinSize(1, {
    message: 'Deve ter pelo menos um gênero no array.'
  })
  @Matches(uuidRegex, {
    message: 'O id do gênero deve ser um uuid válido.',
    each: true
  })
    genres!: string[]
}
