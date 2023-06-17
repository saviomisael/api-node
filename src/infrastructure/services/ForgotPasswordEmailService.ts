import { type ISendEmailService } from '$/domain/services/ISendEmailService'
import { SendEmailService } from './SendEmailService'

export class ForgotPasswordEmailService implements ISendEmailService {
  private readonly sendEmailService = new SendEmailService()
  async sendEmail(username: string, randomPassword: string, email: string): Promise<void> {
    await this.sendEmailService.setTemplate('forgotPassword', {
      username,
      password: randomPassword,
      date: `${new Date(new Date().toUTCString()).getTime()}`
    })
    await this.sendEmailService.sendEmail(email, `Sua senha temporária. ${new Date().toUTCString()}`)
  }
}
