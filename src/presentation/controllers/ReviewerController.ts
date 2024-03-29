import { type TokenDTO } from '$/application/dto/TokenDTO'
import { CredentialsError, EmailInUseError, ReviewerNotFoundError, UsernameInUseError } from '$/application/errors'
import { ReviewerService } from '$/application/services/ReviewerService'
import { type ReviewerDetails } from '$/domain/value-objects/ReviewerDetails'
import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import { HttpHandler } from '../HttpHandler'
import { ChangePasswordDTO, CreateReviewerDTO, ForgotPasswordDTO, SignInDTO, type ResponseDTO } from '../dto'
import { ReviewerMapper } from '../mapper/ReviewerMapper'
import { type JWTRequest } from '../requests/JWTRequest'

export class ReviewerController extends HttpHandler {
  private readonly service = new ReviewerService()

  async createReviewer(req: Request, res: Response): Promise<Response> {
    const dto = new CreateReviewerDTO()
    dto.username = req.body.username
    dto.email = req.body.email
    dto.password = req.body.password
    dto.confirmPassword = req.body.confirmPassword

    let response: ResponseDTO<TokenDTO>

    if (dto.password !== dto.confirmPassword) {
      response = {
        data: [],
        errors: ['A senha e a confirmação de senha devem ser iguais.'],
        success: false
      }

      return this.badRequest(res, response)
    }

    const errors = await validate(dto)

    if (errors.length > 0) {
      response = {
        data: [],
        errors: errors.flatMap((x) => Object.values(x.constraints as Record<string, string>)),
        success: false
      }

      return this.badRequest(res, response)
    }

    try {
      const token = await this.service.createReviewer(await ReviewerMapper.fromCreateReviewerDTOToEntity(dto))

      response = {
        data: [token],
        errors: [],
        success: true
      }

      return this.created(res, response)
    } catch (error) {
      if (error instanceof EmailInUseError || error instanceof UsernameInUseError) {
        response = {
          data: [],
          errors: [error.message],
          success: false
        }

        return this.badRequest(res, response)
      }

      throw error
    }
  }

  async signIn(req: Request, res: Response): Promise<Response> {
    const dto = new SignInDTO()
    dto.password = req.body.password
    dto.username = req.body.username

    let response: ResponseDTO<TokenDTO>

    const errors = await validate(dto)

    if (errors.length > 0) {
      response = {
        data: [],
        success: false,
        errors: errors.flatMap((x) => Object.values(x.constraints as Record<string, string>))
      }

      return this.badRequest(res, response)
    }

    try {
      const token = await this.service.signIn(dto.username, dto.password)

      response = {
        data: [token],
        success: true,
        errors: []
      }

      return this.ok(res, response)
    } catch (error: any) {
      response = {
        data: [],
        success: false,
        errors: [error.message]
      }
      if (error instanceof ReviewerNotFoundError) {
        return this.notFound(res, response)
      }

      if (error instanceof CredentialsError) {
        return this.notAuthorized(res, response)
      }

      throw error
    }
  }

  async changePassword(req: JWTRequest, res: Response): Promise<Response> {
    const dto = new ChangePasswordDTO()
    dto.newPassword = req.body.newPassword
    dto.confirmNewPassword = req.body.confirmNewPassword
    let response: ResponseDTO<any>

    if (dto.confirmNewPassword !== dto.newPassword) {
      response = {
        data: [],
        success: false,
        errors: ['A nova senha e a confirmação de senha devem ser iguais.']
      }

      return this.badRequest(res, response)
    }

    const errors = await validate(dto)

    if (errors.length > 0) {
      response = {
        data: [],
        success: false,
        errors: errors.flatMap((x) => Object.values(x.constraints as Record<string, string>))
      }

      return this.badRequest(res, response)
    }

    const { payload } = req

    await this.service.changePassword(payload.name, dto.newPassword)

    return this.noContent(res)
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const dto = new ForgotPasswordDTO()
    dto.username = req.params.username
    let response: ResponseDTO<any>

    const errors = await validate(dto)

    if (errors.length > 0) {
      response = {
        data: [],
        success: false,
        errors: errors.flatMap((x) => Object.values(x.constraints as Record<string, string>))
      }

      return this.badRequest(res, response)
    }

    try {
      await this.service.forgotPassword(dto.username)

      return this.noContent(res)
    } catch (error) {
      if (error instanceof ReviewerNotFoundError) {
        response = {
          data: [],
          success: false,
          errors: [error.message]
        }

        return this.notFound(res, response)
      }

      throw error
    }
  }

  refreshToken(req: JWTRequest, res: Response): Response {
    const { payload } = req

    const dto = this.service.refreshToken(payload)

    return this.created(res, {
      data: [dto],
      errors: [],
      success: true
    })
  }

  async deleteReviewer(req: JWTRequest, res: Response): Promise<Response> {
    const { payload } = req

    await this.service.deleteReviewerByUsername(payload.name)

    return this.noContent(res)
  }

  async getDetailsByUsername(req: Request, res: Response): Promise<Response> {
    let response: ResponseDTO<ReviewerDetails>

    try {
      const details = await this.service.getDetailsByUsername(req.params.username)

      response = {
        data: [details],
        errors: [],
        success: false
      }

      return this.ok(res, response)
    } catch (error) {
      if (error instanceof ReviewerNotFoundError) {
        response = {
          data: [],
          success: false,
          errors: [error.message]
        }

        return this.notFound(res, response)
      }

      throw error
    }
  }
}
