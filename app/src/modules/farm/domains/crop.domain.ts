import { CreateCropDTO } from '../dto/crop.dto';
import { cropType } from '@configs/farm';
import { Domain } from '@shared/domain';

export class Crop extends Domain {
  private _name: cropType;

  constructor(data: CreateCropDTO) {
    super(data.id);
    this._name = data.name;
  }

  static create(data: CreateCropDTO): Crop {
    const crop_id = Crop.createUniqueId();
    return new Crop({
      id: crop_id,
      name: data.name,
    });
  }

  public setName(name: cropType): Crop {
    this._name = name;
    return this;
  }

  get name(): cropType {
    return this._name;
  }
}
