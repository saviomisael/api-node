import { type Payload } from '$/infrastructure/JWTGenerator'
import { type Request } from 'express'

export interface JWTRequest extends Request {
  payload: Payload
}
