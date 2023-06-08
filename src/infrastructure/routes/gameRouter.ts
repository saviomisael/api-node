import { GameController } from '$/presentation/controllers/GameController'
import { Router } from 'express'
import { apiRoutes } from './apiRoutes'

const router = Router()
const controller = new GameController()

router.post(apiRoutes.games.create, controller.createGame.bind(controller))

export default router