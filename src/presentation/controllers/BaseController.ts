import {
  badRequest,
  created,
  internalServerError,
  noContent,
  notFound,
  ok
} from '$/infrastructure/helpers/http-helper'
import { type Response } from 'express'

export abstract class BaseController {
  protected badRequest<T>(res: Response, body: T): Response {
    return badRequest(res, body)
  }

  protected created<T>(res: Response, body: T): Response {
    return created(res, body)
  }

  protected ok<T>(res: Response, body: T): Response {
    return ok(res, body)
  }

  protected noContent (res: Response): Response {
    return noContent(res)
  }

  protected notFound<T>(res: Response, body: T): Response {
    return notFound(res, body)
  }

  protected internalServerError<T>(res: Response, body: T): Response {
    return internalServerError(res, body)
  }
}
