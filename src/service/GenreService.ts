import { GenreRepository } from '../data/repository/GenreRepository';
import { Genre } from '../model/Genre';

export class GenreService {
  private repository: GenreRepository;

  constructor() {
    this.repository = new GenreRepository();
  }

  public async createGenre(genreName: string) {
    const isAlreadyCreated =
      (await this.repository.getGenreByName(genreName)) == null;

    if (isAlreadyCreated) {
      return null;
    }

    const genre = new Genre(genreName);

    const genreRecorded = await this.repository.createGenre(genre);

    return genreRecorded;
  }
}
