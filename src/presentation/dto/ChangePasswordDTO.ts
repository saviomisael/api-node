import { Matches } from 'class-validator'
import { passwordRegex } from '../constants'

export class ChangePasswordDTO {
  @Matches(passwordRegex, {
    message:
      'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
  })
  newPassword!: string
}
