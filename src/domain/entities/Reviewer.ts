import { newDateUtcTime } from '$/infrastructure/constants'
import { addHoursHelper } from '../helpers/addHoursHelper'
import { AggregateRoot } from './AggregateRoot'

export class Reviewer extends AggregateRoot {
  private passwordTemporary!: string
  private passwordTempTime!: Date | null
  private createdAtUtcTime: Date
  constructor(private readonly username: string, private readonly password: string, private readonly email: string) {
    super()
    this.createdAtUtcTime = newDateUtcTime()
  }

  setPasswordTemporary(password: string): void {
    this.passwordTemporary = password
  }

  getPasswordTemporary(): string {
    return this.passwordTemporary
  }

  generatePasswordTempTime(): void {
    this.passwordTempTime = addHoursHelper(newDateUtcTime(), 1)
  }

  getPasswordTempTime(): Date | null {
    return this.passwordTempTime
  }

  setPasswordTempTime(date: Date | null): void {
    this.passwordTempTime = date
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

  setCreatedAtUtcTime(date: Date): void {
    this.createdAtUtcTime = date
  }

  getEmail(): string {
    return this.email
  }
}
