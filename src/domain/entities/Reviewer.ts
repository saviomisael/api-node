import { newDateUtcTime } from '$/infrastructure/constants'
import { addHoursHelper } from '../helpers/addHoursHelper'
import { AggregateRoot } from './AggregateRoot'

export class Reviewer extends AggregateRoot {
  private temporaryPassword!: string
  private tempPasswordTime!: Date | null
  private createdAtUtcTime: Date
  constructor(private readonly username: string, private readonly password: string, private readonly email: string) {
    super()
    this.createdAtUtcTime = newDateUtcTime()
  }

  setTemporaryPassword(password: string): void {
    this.temporaryPassword = password
  }

  getTemporaryPassword(): string {
    return this.temporaryPassword
  }

  generateTempPasswordTime(): void {
    this.tempPasswordTime = addHoursHelper(newDateUtcTime(), 1)
  }

  getTempPasswordTime(): Date | null {
    return this.tempPasswordTime
  }

  setTempPasswordTime(date: Date | null): void {
    this.tempPasswordTime = date
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
