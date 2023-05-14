import { Router } from 'express'
import { PlatformController } from '../controller/PlatformController'
import { apiRoutes } from './apiRoutes'

const router = Router()

const controller = new PlatformController()

router
  .post(apiRoutes.platforms.create, controller.createPlatform.bind(controller))

export default router
