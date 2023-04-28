import { Connection } from 'mysql2/promise';
import { Genre } from '../../model/Genre';
import { DBConnection } from '../DBConnection';
import { IGenreRepository } from './IGenreRepository';

export class GenreRepository implements IGenreRepository {
  private connection!: Connection;

  constructor() {}
  async createGenre(genre: Genre): Promise<Genre> {
    this.connection = await DBConnection.getConnection();

    await this.connection.execute(
      'INSERT INTO genres (id, name) VALUES (?, ?)',
      [genre.getId(), genre.getName()],
    );

    const newGenre = await this.getGenreById(genre.getId());

    return newGenre;
  }

  async getGenreById(id: string): Promise<Genre> {
    this.connection = await DBConnection.getConnection();

    const [row] = await this.connection.execute(
      'SELECT * FROM genres WHERE id = ?',
      [id],
    );

    const [data] = row as Array<Genre>;

    return data;
  }

  async getGenreByName(name: string): Promise<Genre | null> {
    this.connection = await DBConnection.getConnection();

    const result = await this.connection.execute(
      'SELECT * FROM genres WHERE name = ?',
      [name],
    );

    const row = result[0] as Array<Genre>;

    if (row.length == 0) {
      return null;
    }

    const [genre] = row;

    return genre;
  }
}
