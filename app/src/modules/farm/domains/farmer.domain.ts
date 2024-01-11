import { Document } from '@shared/valueObjects/document';
import { CreateFarmerDTO } from '../dto/farmer.dto';
import { Domain } from '@shared/domain';

export class Farmer extends Domain {
  private _name: string;
  private _document: Document;
  private _user_id: string;

  constructor(data: CreateFarmerDTO) {
    super(data.id);
    this._name = data.name;
    this._document = data.document;
    this._user_id = data.user_id;
  }

  static create(data: CreateFarmerDTO): Farmer {
    const farmer_id = Farmer.createUniqueId();
    return new Farmer({
      id: farmer_id,
      name: data.name,
      document: data.document,
      user_id: data.user_id,
    });
  }

  public setName(name: string): Farmer {
    this._name = name;
    return this;
  }

  public setDocument(document: Document): Farmer {
    this._document = document;
    return this;
  }

  public setUser(user_id: string): Farmer {
    this._user_id = user_id;
    return this;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document.document;
  }

  get document_object(): Document {
    return this._document;
  }

  get user_id(): string {
    return this._user_id;
  }
}
