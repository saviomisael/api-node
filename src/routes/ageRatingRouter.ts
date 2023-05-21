import { Router } from 'express'
import { AgeRatingController } from '../controller/AgeRatingController'
import { apiRoutes } from './apiRoutes'

const router = Router()
const controller = new AgeRatingController()

router.get(apiRoutes.ageRatings.getAll, controller.getAll.bind(controller))

export default router
