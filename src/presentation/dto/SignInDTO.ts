import { Matches, MaxLength, MinLength } from 'class-validator'
import { passwordRegex } from '../constants'

export class SignInDTO {
  @MinLength(3, {
    message: 'O nome do usuário deve ter pelo menos 3 caracteres.'
  })
  @MaxLength(255, {
    message: 'O nome do usuário deve ter no máximo 255 caracteres.'
  })
  username!: string

  @Matches(passwordRegex, {
    message:
      'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
  })
  password!: string
}
