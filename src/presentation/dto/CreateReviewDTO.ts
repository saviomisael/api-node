import { Matches, Max, MaxLength, Min, MinLength } from 'class-validator'
import { uuidRegex } from '../constants'

export class CreateReviewDTO {
  @MinLength(10, {
    message: 'A review deve ter no mínimo 10 caracteres.'
  })
  @MaxLength(1000, {
    message: 'A review deve ter no máximo 1000 caracteres.'
  })
  description!: string

  @Min(1, {
    message: 'A review deve ter pelo menos 1 estrela.'
  })
  @Max(5, {
    message: 'A review deve ter no máximo 5 estrelas.'
  })
  stars!: number

  @Matches(uuidRegex, {
    message: 'O id do jogo deve ser um uuid válido.'
  })
  gameId!: string

  reviewerId!: string
}
