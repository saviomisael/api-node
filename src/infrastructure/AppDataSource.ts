import { AgeRating } from '$/domain/entities'
import { DataSource } from 'typeorm'

export class AppDataSource {
  private static dataSource: DataSource
  private constructor() {}

  static getDataSource(): DataSource {
    if (AppDataSource.dataSource === undefined) {
      AppDataSource.dataSource = new DataSource({
        type: 'mysql',
        host: 'db',
        port: 3306,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: 'gamesdb',
        synchronize: true,
        logging: false,
        entities: [AgeRating]
      })
    }

    return AppDataSource.dataSource
  }
}
