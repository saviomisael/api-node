import mysql, { Connection } from 'mysql2/promise';

export class DBConnection {
  private static instance: Connection;

  public static async getConnection() {
    const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD } = process.env;

    if (!DBConnection.instance) {
      DBConnection.instance = await mysql.createConnection({
        host: 'db',
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        port: 3306,
      });
    }

    return DBConnection.instance;
  }
}
