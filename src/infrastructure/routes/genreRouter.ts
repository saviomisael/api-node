import { GenreService } from '$/application/services/GenreService'
import { GenreController } from '$/presentation/controllers/GenreController'
import { Router } from 'express'
import { GenreRepository } from '../repositories'
import { apiRoutes } from './apiRoutes'

const genreRouter = Router()
const controller = new GenreController(new GenreService(new GenreRepository()))

genreRouter.post(apiRoutes.genres.create, controller.createGenre.bind(controller))

genreRouter.get(apiRoutes.genres.getAll, controller.getAllGenres.bind(controller))

genreRouter.delete(apiRoutes.genres.deleteById, controller.deleteGenre.bind(controller))

export default genreRouter
