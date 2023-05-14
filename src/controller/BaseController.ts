import { type Response } from 'express'
import {
  badRequest,
  created,
  noContent,
  notFound,
  ok
} from '../util/http-helper'

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
}
