export interface ISendEmailService {
  sendEmail: (...parameters: any[]) => Promise<void>
}
