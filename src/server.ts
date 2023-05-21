import 'express-async-errors'

import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express'
import Swagger from 'swagger-ui-express'
import { seedDB } from './data/seedDB'
import genreRouter from './routes/genreRouter'
import platformRouter from './routes/platformRouter'
import SwaggerDocs from './swagger.json'
import { internalServerError } from './util/http-helper'

dotenv.config()

const app = express()

app.use(bodyParser.json())

app.use(cors())

app.use('/docs', Swagger.serve, Swagger.setup(SwaggerDocs))

app.use(genreRouter)
app.use(platformRouter)

app.use(
  (error: Error,
    _: Request,
    res: Response,
    _2: NextFunction): Response => {
    console.error(error)

    return internalServerError(res, {
      data: [],
      success: false,
      errors: ['Internal server error']
    })
  }
)

app.listen('3333', async () => {
  console.log('App running on http://localhost:3333')
  await seedDB()
})

export default app
