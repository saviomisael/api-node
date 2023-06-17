import { readFile } from 'fs/promises'
import handlebars from 'handlebars'
import path from 'path'
import { EmailTransporter } from '../EmailTransporter'

export class SendEmailService {
  private readonly transporter = EmailTransporter.getTransporter()
  private html!: string

  async sendEmail(email: string, subject: string): Promise<void> {
    if (this.html === undefined) {
      throw new Error('Você deve definir o template com setTemplate.')
    }

    await this.transporter.sendMail({
      from: 'api-node',
      to: email,
      subject,
      html: this.html
    })
  }

  async setTemplate(templateFile: 'changePassword' | 'forgotPassword', inputs: Record<string, string>): Promise<void> {
    const htmlFile = await readFile(path.resolve(__dirname, `../templates/${templateFile}Template.html`), {
      encoding: 'utf8'
    })

    const template = handlebars.compile(htmlFile)

    this.html = template({ ...inputs })
  }
}
