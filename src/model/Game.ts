import { Genre } from './Genre';
import { Platform } from './Platform';

export class Game {
  private id!: string;

  constructor(
    private name: string,
    private price: number,
    private description: string,
    private platforms: Platform[],
    private releaseDate: Date,
    private genres: Genre[],
  ) {}
}
