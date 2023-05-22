import { type BaseEntity } from '../entities/BaseEntity'

export interface ResponseDTO<T extends BaseEntity> {
  errors: string[]
  success: boolean
  data: T[]
}
