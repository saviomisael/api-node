import { Router } from 'express'
import ageRatingRouter from './ageRatingRouter'
import gameRouter from './gameRouter'
import genreRouter from './genreRouter'
import platformRouter from './platformRouter'
import reviewerRouter from './reviewerRouter'

const router = Router()

router.use(ageRatingRouter)
router.use(genreRouter)
router.use(platformRouter)
router.use(gameRouter)
router.use(reviewerRouter)

export default router
