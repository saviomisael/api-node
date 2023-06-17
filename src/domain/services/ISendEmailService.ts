import { type Transporter } from 'nodemailer'

export interface ISendEmailService {
  transporter: Transporter
  sendEmail: (...parameters: any[]) => Promise<void>
}
