import { GenreRepository } from '../data/repository/GenreRepository';
import { Genre } from '../model/Genre';

export class GenreService {
  private repository: GenreRepository;

  constructor() {
    this.repository = new GenreRepository();
  }

  public createGenre(genreName: string) {
    const isAlreadyCreated = this.repository.getGenreByName(genreName) == null;

    if (isAlreadyCreated) {
      return null;
    }

    const genre = new Genre(genreName);

    const genreRecorded = this.repository.createGenre(genre);

    return genreRecorded;
  }
}
