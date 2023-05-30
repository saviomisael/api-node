import { PlatformService } from '$/application/services/PlatformService'
import { type Platform } from '$/domain/entities'
import { apiRoutes } from '$/infrastructure/routes/apiRoutes'
import { type CacheService } from '$/infrastructure/services/CacheService'
import { CacheServiceFactory } from '$/infrastructure/services/CacheServiceFactory'
import { HalWrapper } from '$/presentation/HalWrapper'
import { BaseController } from '$/presentation/controllers/BaseController'
import { CreatePlatformDTO, DeletePlatformDTO, type ResponseDTO } from '$/presentation/dto'
import { validate } from 'class-validator'
import { type Request, type Response } from 'express'

export class PlatformController extends BaseController {
  private readonly platformService = new PlatformService()
  private readonly cacheService: CacheService<Platform[]> = CacheServiceFactory.getPlatformCacheService()

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

    const newPlatform = await this.platformService.createPlatform(dto.name)

    if (newPlatform == null) {
      response = {
        data: [],
        errors: ['This platform already exists.'],
        success: false
      }

      return this.badRequest(res, response)
    }

    const resource = new HalWrapper(newPlatform, apiRoutes.platforms.create)
      .addLink('GET_list', apiRoutes.platforms.getAll)
      .getResource()

    response = {
      data: [resource],
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

    const isDeleted = await this.platformService.deletePlatformById(dto.id)

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

  async getAllPlatforms (_: Request, res: Response): Promise<Response> {
    const platformsFromCache = await this.cacheService.getData()
    let response: ResponseDTO<Platform>

    if (platformsFromCache != null) {
      response = {
        data: [...platformsFromCache],
        success: true,
        errors: []
      }

      return this.ok(res, response)
    }

    const platforms = await this.platformService.getAllPlatforms()
    await this.cacheService.setData(platforms)

    response = {
      data: [...platforms],
      success: true,
      errors: []
    }

    return this.ok(res, response)
  }
}
