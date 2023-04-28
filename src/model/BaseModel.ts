import { v4 } from 'uuid';

export abstract class BaseModel {
  private id: string;

  constructor() {
    this.id = v4();
  }
}
