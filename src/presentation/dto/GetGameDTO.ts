import { Matches } from 'class-validator'

export class GetGameDTO {
  @Matches(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/, {
    message: 'O id do jogo deve ser um uuid válido.'
  })
  id!: string
}
