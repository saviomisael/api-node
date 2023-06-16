import { JWTGenerator } from '$/infrastructure/JWTGenerator'
import { type NextFunction, type Response } from 'express'
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken'
import { HttpHandler } from '../HttpHandler'
import { type ResponseDTO } from '../dto'
import { type JWTRequest } from '../requests/JWTRequest'

export class AuthMiddleware extends HttpHandler {
  async isAuthenticaded(req: JWTRequest, res: Response, next: NextFunction): Promise<Response | undefined> {
    const authorizationHeader = req.headers.authorization

    let response: ResponseDTO<any> = {
      data: [],
      errors: ['Authorization header não enviado.'],
      success: false
    }

    if (authorizationHeader === undefined) {
      return this.badRequest(res, response)
    }

    const token = authorizationHeader.split(' ')[1]

    const generator = new JWTGenerator()

    try {
      const payload = await generator.verifyToken(token)

      req.payload = payload
      next()
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        response = {
          data: [],
          errors: ['Token expirou.'],
          success: false
        }

        return this.badRequest(res, response)
      }

      if (error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
        response = {
          data: [],
          errors: ['Token inválido.'],
          success: false
        }

        return this.badRequest(res, response)
      }

      throw error
    }
  }
}
