import 'reflect-metadata'

import 'express-async-errors'

import { internalServerError } from '$/infrastructure/helpers/http-helper'
import appRouter from '$/infrastructure/routes/appRouter'
import { seedDB } from '$/infrastructure/seedDB'
import SwaggerDocs from '$/infrastructure/swagger.json'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { type NextFunction, type Request, type Response } from 'express'
import Swagger from 'swagger-ui-express'
import { AppDataSource } from './AppDataSource'

dotenv.config()

const app = express()

app.use(bodyParser.json())

app.use(cors())

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!')
    await seedDB()
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })

if (process.env.NODE_ENV !== 'production') app.use('/docs', Swagger.serve, Swagger.setup(SwaggerDocs))

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
})

export default app
