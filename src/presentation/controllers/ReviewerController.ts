import { type TokenDTO } from '$/application/dto/TokenDTO'
import { EmailInUseError, UsernameInUseError } from '$/application/errors'
import { ReviewerService } from '$/application/services/ReviewerService'
import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import { CreateReviewerDTO, type ResponseDTO } from '../dto'
import { ReviewerMapper } from '../mapper/ReviewerMapper'
import { BaseController } from './BaseController'

export class ReviewerController extends BaseController {
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
}