import { generateV4Id } from '@shared/utils/generate_id';

export abstract class Domain {
  protected _id: string;

  constructor(id?: string) {
    if (id) this._id = id;
    else this._id = Domain.createUniqueId();
  }

  protected static createUniqueId(): string {
    return generateV4Id();
  }

  get id(): string {
    return this._id;
  }
}
