import mysql, { type Connection } from 'mysql2/promise'

export class DBConnection {
  private static instance: Connection

  private constructor () {}

  public static async getConnection (): Promise<Connection> {
    const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD } = process.env

    if (DBConnection.instance === null || DBConnection.instance === undefined) {
      DBConnection.instance = await mysql.createConnection({
        host: 'db',
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        port: 3306
      })
    }

    return DBConnection.instance
  }
}
