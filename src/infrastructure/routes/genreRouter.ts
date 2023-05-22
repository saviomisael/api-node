import { GenreController } from '$/presentation/controllers/GenreController'
import { Router } from 'express'
import { apiRoutes } from './apiRoutes'

const genreRouter = Router()
const controller = new GenreController()

genreRouter
  .post(apiRoutes.genres.create, controller.createGenre.bind(controller))

genreRouter
  .get(apiRoutes.genres.getAll, controller.getAllGenres.bind(controller))

genreRouter
  .delete(apiRoutes.genres.deleteById, controller.deleteGenre.bind(controller))

export default genreRouter
