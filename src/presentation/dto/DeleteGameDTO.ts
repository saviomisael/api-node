import { Matches } from 'class-validator'
import { uuidRegex } from '../constants'

export class DeleteGameDTO {
  @Matches(uuidRegex, {
    message: 'O id do jogo deve ser um uuid válido.'
  })
  id!: string
}
