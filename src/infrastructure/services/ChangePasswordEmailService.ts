import { type ISendEmailService } from '$/domain/services/ISendEmailService'
import { readFile } from 'fs/promises'
import handlebars from 'handlebars'
import path from 'path'
import { EmailTransporter } from '../EmailTransporter'

export class ChangePasswordEmailService implements ISendEmailService {
  private readonly transporter = EmailTransporter.getTransporter()
  async sendEmail(username: string, email: string): Promise<void> {
    const html = await readFile(path.resolve(__dirname, '../templates/changePasswordTemplate.html'), {
      encoding: 'utf8'
    })

    const template = handlebars.compile(html)

    const htmlToSend = template({ username, date: new Date().getTime() })

    await this.transporter.sendMail({
      from: 'api-node',
      to: email,
      subject: `Alteração de Senha ${new Date().toUTCString()}`,
      html: htmlToSend
    })
  }
}
