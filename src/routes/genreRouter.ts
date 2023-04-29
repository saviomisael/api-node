import { Router } from 'express'
import { GenreController } from '../controller/GenreController'
import { apiRoutes } from './ApiRoutes'

const genreRouter = Router()
const controller = new GenreController()

genreRouter.post(apiRoutes.genres.create, controller.createGenre)

export default genreRouter
