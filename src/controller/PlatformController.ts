import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import { CreatePlatformDTO, type ResponseDTO } from '../dto'
import { type Platform } from '../model/Platform'
import { PlatformService } from '../service/PlatformService'
import { BaseController } from './BaseController'

export class PlatformController extends BaseController {
  private readonly service = new PlatformService()

  async createPlatform (req: Request, res: Response): Promise<Response> {
    let response: ResponseDTO<Platform>

    const dto = new CreatePlatformDTO(req.body.name)

    const errors = await validate(dto)

    if (errors.length > 0 && errors[0].constraints != null) {
      response = {
        data: [],
        errors: [...Object.values(errors[0].constraints)],
        success: false
      }

      return this.badRequest(res, response)
    }

    const newPlatform = await this.service.createPlatform(dto.name)

    if (newPlatform == null) {
      response = {
        data: [],
        errors: ['This platform already exists.'],
        success: false
      }

      return this.badRequest(res, response)
    }

    response = {
      data: [newPlatform],
      errors: [],
      success: true
    }

    return this.created(res, response)
  }
}
