import {
  badRequest,
  conflict,
  created,
  internalServerError,
  noContent,
  notAuthorized,
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

  protected noContent(res: Response): Response {
    return noContent(res)
  }

  protected notFound<T>(res: Response, body: T): Response {
    return notFound(res, body)
  }

  protected internalServerError<T>(res: Response, body: T): Response {
    return internalServerError(res, body)
  }

  protected conflict<T>(res: Response, body: T): Response {
    return conflict(res, body)
  }

  protected notAuthorized<T>(res: Response, body: T): Response {
    return notAuthorized(res, body)
  }
}
