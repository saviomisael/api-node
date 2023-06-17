import { ReviewerController } from '$/presentation/controllers/ReviewerController'
import { AuthMiddleware } from '$/presentation/middleware/AuthMiddleware'
import { type JWTRequest } from '$/presentation/requests/JWTRequest'
import { Router } from 'express'
import { apiRoutes } from './apiRoutes'

const router = Router()

const controller = new ReviewerController()
const authMiddleware = new AuthMiddleware()

router.post(apiRoutes.reviewers.create, controller.createReviewer.bind(controller))
router.post(apiRoutes.reviewers.signIn, controller.signIn.bind(controller))
router.put(
  apiRoutes.reviewers.changePassword,
  async (req, res, next) => {
    await authMiddleware.isAuthenticated(req as JWTRequest, res, next)
  },
  async (req, res) => {
    await controller.changePassword(req as JWTRequest, res)
  }
)
router.post(apiRoutes.reviewers.forgotPassword, controller.forgotPassword.bind(controller))

export default router
