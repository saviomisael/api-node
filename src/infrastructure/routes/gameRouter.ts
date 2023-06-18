import { GameController } from '$/presentation/controllers/GameController'
import { AuthMiddleware } from '$/presentation/middleware/AuthMiddleware'
import { type JWTRequest } from '$/presentation/requests/JWTRequest'
import { Router } from 'express'
import { apiRoutes } from './apiRoutes'

const router = Router()
const controller = new GameController()
const authMiddleware = new AuthMiddleware()

router.post(apiRoutes.games.create, controller.createGame.bind(controller))
router.get(apiRoutes.games.getById, controller.getGameById.bind(controller))
router.put(apiRoutes.games.updateGameById, controller.updateGameById.bind(controller))
router.delete(apiRoutes.games.deleteById, controller.deleteGameById.bind(controller))
router.get(apiRoutes.games.getAll, controller.getAll.bind(controller))
router.post(
  apiRoutes.games.createReview,
  async (req, res, next) => {
    await authMiddleware.isAuthenticated(req as JWTRequest, res, next)
  },
  async (req, res) => {
    await controller.createReview(req as JWTRequest, res)
  }
)

export default router
