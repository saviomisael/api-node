import { type Response } from 'express'
import { badRequest, created, noContent, notFound, ok } from '../util/http-helper'

export abstract class BaseController {
  badRequest<T>(res: Response, body: T): Response {
    return badRequest(res, body)
  }

  created<T>(res: Response, body: T): Response {
    return created(res, body)
  }

  ok<T>(res: Response, body: T): Response {
    return ok(res, body)
  }

  noContent (res: Response): Response {
    return noContent(res)
  }

  notFound<T>(res: Response, body: T): Response {
    return notFound(res, body)
  }
}
