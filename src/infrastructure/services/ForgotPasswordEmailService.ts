import { type ISendEmailService } from '$/domain/services/ISendEmailService'
import { SendEmailService } from './SendEmailService'

export class ForgotPasswordEmailService implements ISendEmailService {
  private readonly sendEmailService = new SendEmailService()
  async sendEmail(username: string, randomPassword: string, email: string): Promise<void> {
    await Promise.all([
      this.sendEmailService.setTemplate('forgotPassword', {
        username,
        password: randomPassword,
        date: `${new Date(new Date().toUTCString()).getTime()}`
      }),
      this.sendEmailService.sendEmail(email, `Alteração de Senha ${new Date().toUTCString()}`)
    ])
  }
}
