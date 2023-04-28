import { BaseModel } from './BaseModel';

export class Genre extends BaseModel {
  constructor(private name: string) {
    super();
  }

  public getName() {
    return this.name;
  }
}
