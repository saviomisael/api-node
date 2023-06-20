import { AgeRating, Game, Genre, Platform, Review, Reviewer } from '$/domain/entities'
import dotenv from 'dotenv'
import { DataSource, type DataSourceOptions } from 'typeorm'

dotenv.config()

let options: DataSourceOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'gamesdb',
  logging: false,
  entities: [AgeRating, Genre, Platform, Reviewer, Game, Review],
  extra: {
    charset: 'utf8mb4_unicode_ci'
  },
  migrations: ['./src/infrastructure/migrations/*.ts']
}

if (process.env.NODE_ENV !== 'production') {
  options = {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: process.env.PGUSER,
    password: process.env.POSTGRES_PASSWORD,
    database: 'gamesdb',
    synchronize: true,
    logging: false,
    entities: [AgeRating, Genre, Platform, Reviewer, Game, Review],
    migrations: ['./src/infrastructure/migrations/*.ts']
  }
}
export const AppDataSource = new DataSource({
  ...options
})
