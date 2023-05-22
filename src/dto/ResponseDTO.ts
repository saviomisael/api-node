import { type BaseEntity } from '$/domain/entities/BaseEntity'

export interface ResponseDTO<T extends BaseEntity> {
  errors: string[]
  success: boolean
  data: T[]
}
