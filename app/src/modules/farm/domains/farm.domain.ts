import { CreateFarmDTO } from '../dto/farm.dto';
import { Domain } from '@shared/domain';
import { Crop } from './crop.domain';

export class Farm extends Domain {
  private _name: string;
  private _city: string;
  private _state: string;
  private _total_area: number;
  private _total_agricultural_area: number;
  private _total_vegetation_area: number;
  private _farmer_id: string;
  private _user_id: string;
  private _crops: Crop[];

  constructor(data: CreateFarmDTO) {
    super(data.id);
    this._name = data.name;
    this._city = data.city;
    this._state = data.state;
    this._total_area = data.total_area;
    this._total_agricultural_area = data.total_agricultural_area;
    this._total_vegetation_area = data.total_vegetation_area;
    this._farmer_id = data.farmer_id;
    this._user_id = data.user_id;
    this._crops = data.crops;
  }

  static create(data: CreateFarmDTO): Farm {
    const farm_id = Farm.createUniqueId();
    return new Farm({
      id: farm_id,
      name: data.name,
      city: data.city,
      state: data.state,
      total_area: data.total_area,
      total_agricultural_area: data.total_agricultural_area,
      total_vegetation_area: data.total_vegetation_area,
      farmer_id: data.farmer_id,
      user_id: data.user_id,
      crops: data.crops,
    });
  }

  public setName(name: string): Farm {
    this._name = name;
    return this;
  }

  public setCity(city: string): Farm {
    this._city = city;
    return this;
  }

  public setState(state: string): Farm {
    this._state = state;
    return this;
  }

  public setTotalArea(total_area: number): Farm {
    this._total_area = total_area;
    return this;
  }

  public setTotalAgriculturalArea(total_agricultural_area: number): Farm {
    this._total_agricultural_area = total_agricultural_area;
    return this;
  }

  public setTotalVegetationArea(total_vegetation_area: number): Farm {
    this._total_vegetation_area = total_vegetation_area;
    return this;
  }

  public setFarmerId(farmer_id: string): Farm {
    this._farmer_id = farmer_id;
    return this;
  }

  public addCrop(crop: Crop): Farm {
    this._crops.push(crop);
    return this;
  }

  public setUser(user_id: string): Farm {
    this._user_id = user_id;
    return this;
  }

  public isAreValid(): boolean {
    return (
      this._total_agricultural_area + this._total_vegetation_area <= this._total_area
    );
  }

  public removeCrop(crop: Crop): Farm {
    const index = this._crops.indexOf(crop);
    if (index > -1) {
      this._crops.splice(index, 1);
    }
    return this;
  }

  get user_id(): string {
    return this._user_id;
  }

  get name(): string {
    return this._name;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get total_area(): number {
    return this._total_area;
  }

  get total_agricultural_area(): number {
    return this._total_agricultural_area;
  }

  get total_vegetation_area(): number {
    return this._total_vegetation_area;
  }

  get farmer_id(): string {
    return this._farmer_id;
  }

  get crops(): Crop[] {
    return this._crops;
  }
}
