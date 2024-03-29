import 'express-async-errors'

import { internalServerError } from '$/infrastructure/helpers/http-helper'
import appRouter from '$/infrastructure/routes/appRouter'
import { seedDB } from '$/infrastructure/seedDB'
import SwaggerDocs from '$/infrastructure/swagger.json'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { type NextFunction, type Request, type Response } from 'express'
import morgan from 'morgan'
import Swagger from 'swagger-ui-express'

dotenv.config()

const app = express()

app.use(bodyParser.json())

app.use(cors())

app.use(morgan('tiny'))

app.use('/docs', Swagger.serve, Swagger.setup(SwaggerDocs))

app.use(appRouter)

app.use((error: Error, _: Request, res: Response, _2: NextFunction): Response => {
  console.error(error)

  return internalServerError(res, {
    data: [],
    success: false,
    errors: ['Internal server error']
  })
})

app.listen('3333', async () => {
  console.log('App running on http://localhost:3333')
  await seedDB()
})

export default app
