import { validate } from 'class-validator'
import { type Request, type Response } from 'express'
import { CreatePlatformDTO, DeletePlatformDTO, type ResponseDTO } from '../dto'
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

  async deletePlatform (req: Request, res: Response): Promise<Response> {
    let response: ResponseDTO<Platform> = {
      data: [],
      errors: [],
      success: false
    }

    const dto = new DeletePlatformDTO(req.params.id)

    const errors = await validate(dto)

    if (errors.length > 0 && errors[0].constraints != null) {
      response = {
        data: [],
        errors: [...Object.values(errors[0].constraints)],
        success: false
      }

      return this.badRequest(res, response)
    }

    const isDeleted = await this.service.deletePlatformById(dto.id)

    if (!isDeleted) {
      response = {
        data: [],
        success: false,
        errors: ['This platform do not exists.']
      }

      return this.notFound(res, response)
    }

    return this.noContent(res)
  }
}
