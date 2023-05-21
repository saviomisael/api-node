import { Router } from 'express'
import ageRatingRouter from './ageRatingRouter'
import genreRouter from './genreRouter'
import platformRouter from './platformRouter'

const router = Router()

router.use(ageRatingRouter)
router.use(genreRouter)
router.use(platformRouter)

export default router
