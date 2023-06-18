import { AgeRating } from '$/domain/entities'
import dotenv from 'dotenv'
import { DataSource } from 'typeorm'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'gamesdb',
  synchronize: true,
  logging: false,
  entities: [AgeRating],
  extra: {
    charset: 'utf8mb4_unicode_ci'
  },
  migrations: ['./src/migrations/*.ts']
})
