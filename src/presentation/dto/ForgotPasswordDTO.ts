import { MaxLength, MinLength } from 'class-validator'

export class ForgotPasswordDTO {
  @MinLength(3, {
    message: 'O nome do usuário deve ter pelo menos 3 caracteres.'
  })
  @MaxLength(255, {
    message: 'O nome do usuário deve ter no máximo 255 caracteres.'
  })
  username!: string
}
