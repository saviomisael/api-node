import { type ISendEmailService } from '$/domain/services/ISendEmailService'
import { readFile } from 'fs/promises'
import handlebars from 'handlebars'
import { type Transporter } from 'nodemailer'
import path from 'path'
import { EmailTransporter } from '../EmailTransporter'

export class ForgotPasswordEmailService implements ISendEmailService {
  transporter: Transporter = EmailTransporter.getTransporter()
  async sendEmail(username: string, randomPassword: string, email: string): Promise<void> {
    const html = await readFile(path.resolve(__dirname, '../templates/forgotPasswordTemplate.html'), {
      encoding: 'utf8'
    })

    const template = handlebars.compile(html)

    const htmlToSend = template({ username, date: new Date().getTime(), password: randomPassword })

    await this.transporter.sendMail({
      from: 'api-node',
      to: email,
      subject: `Esqueceu a senha / ${new Date().toUTCString()}`,
      html: htmlToSend
    })
  }
}
