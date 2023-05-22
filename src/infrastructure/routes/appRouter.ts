import ageRatingRouter from '$/infrastructure/routes/ageRatingRouter'
import genreRouter from '$/infrastructure/routes/genreRouter'
import platformRouter from '$/infrastructure/routes/platformRouter'
import { Router } from 'express'

const router = Router()

router.use(ageRatingRouter)
router.use(genreRouter)
router.use(platformRouter)

export default router
