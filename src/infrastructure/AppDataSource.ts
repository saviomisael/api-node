import { AgeRating, Game, Genre, Platform, Review, Reviewer } from '$/domain/entities'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'gamesdb',
  logging: false,
  entities: [AgeRating, Genre, Platform, Reviewer, Game, Review],
  migrations: ['./src/infrastructure/migrations/*.ts']
})
