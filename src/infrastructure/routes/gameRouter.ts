import { GameController } from '$/presentation/controllers/GameController'
import { Router } from 'express'
import { apiRoutes } from './apiRoutes'

const router = Router()
const controller = new GameController()

router.post(apiRoutes.games.create, controller.createGame.bind(controller))
router.get(apiRoutes.games.getById, controller.getGameById.bind(controller))
router.put(apiRoutes.games.updateGameById, controller.updateGameById.bind(controller))
router.delete(apiRoutes.games.deleteById, controller.deleteGameById.bind(controller))
router.get(apiRoutes.games.getAll, controller.getAll.bind(controller))

export default router
