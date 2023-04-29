import { Router } from 'express'
import { GenreController } from '../controller/GenreController'
import { apiRoutes } from './apiRoutes'

const genreRouter = Router()
const controller = new GenreController()

genreRouter.post(apiRoutes.genres.create, controller.createGenre.bind(controller))

export default genreRouter
