import { type BaseModel } from '../model/BaseModel'

export interface ResponseDTO<T extends BaseModel> {
  errors: string[]
  success: boolean
  data: T[]
}
