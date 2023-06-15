import { Matches, MaxLength, MinLength } from 'class-validator'
import { emailRegex, passwordRegex } from '../constants'

export class CreateReviewerDTO {
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

  @Matches(passwordRegex, {
    message:
      'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
  })
  confirmPassword!: string

  @Matches(emailRegex, {
    message: 'Você deve enviar um email válido.'
  })
  email!: string
}
