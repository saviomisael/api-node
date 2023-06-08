import { ArrayMaxSize, ArrayMinSize, IsArray, Matches, MinLength } from 'class-validator'

export class CreateGameDTO {
  @MinLength(3, {
    message: 'O jogo deve ter pelo menos 3 caracteres.'
  })
    name!: string

  price!: number

  @MinLength(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.'
  })
    description!: string

  @Matches(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/, {
    message: 'A data de lançamento deve ser uma data.'
  })
    releaseDate!: string

  @Matches(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/, {
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
  @Matches(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/, {
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
  @Matches(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/, {
    message: 'O id do gênero deve ser um uuid válido.',
    each: true
  })
    genres!: string[]
}
