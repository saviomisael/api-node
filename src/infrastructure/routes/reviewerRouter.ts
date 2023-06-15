import { ReviewerController } from '$/presentation/controllers/ReviewerController'
import { Router } from 'express'
import { apiRoutes } from './apiRoutes'

const router = Router()

const controller = new ReviewerController()

router.post(apiRoutes.reviewers.create, controller.createReviewer.bind(controller))

export default router
