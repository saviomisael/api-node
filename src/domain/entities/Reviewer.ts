import { AggregateRoot } from './AggregateRoot'

export class Reviewer extends AggregateRoot {
  private passwordTemporary!: string
  private passwordTempTime!: Date
  private readonly createdAtUtcTime: Date
  constructor(private readonly username: string, private readonly password: string, private readonly email: string) {
    super()
    this.createdAtUtcTime = new Date(new Date().toUTCString())
  }

  setPasswordTemporary(password: string): void {
    this.passwordTemporary = password
  }

  getPasswordTemporary(): string {
    return this.passwordTemporary
  }

  generatePasswordTempTime(): void {
    this.passwordTempTime = new Date(new Date().toUTCString())
  }

  getPasswordTempTime(): Date {
    return this.passwordTempTime
  }

  getUsername(): string {
    return this.username
  }

  getPassword(): string {
    return this.password
  }

  getCreatedAtUtcTime(): Date {
    return this.createdAtUtcTime
  }

  getEmail(): string {
    return this.email
  }
}
