import { createTransport, type Transporter } from 'nodemailer'

export class EmailTransporter {
  private constructor() {}

  static getTransporter(): Transporter {
    return createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    })
  }
}
