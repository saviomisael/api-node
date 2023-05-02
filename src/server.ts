import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import Swagger from 'swagger-ui-express'
import genreRouter from './routes/genreRouter'
import SwaggerDocs from './swagger.json'

dotenv.config()

const app = express()

app.use(bodyParser.json())

app.use(cors())

app.use('/docs', Swagger.serve, Swagger.setup(SwaggerDocs))

app.use(genreRouter)

app.listen('3333', () => {
  console.log('App running on http://localhost:3333')
})
