import { PlatformController } from '$/presentation/controllers/PlatformController'
import { Router } from 'express'
import { apiRoutes } from './apiRoutes'

const router = Router()

const controller = new PlatformController()

router
  .post(apiRoutes.platforms.create, controller.createPlatform.bind(controller))
router
  .delete(apiRoutes.platforms.delete,
    controller.deletePlatform.bind(controller))
router.get(apiRoutes.platforms.getAll, controller
  .getAllPlatforms.bind(controller))

export default router
