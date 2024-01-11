import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { FarmerRepositoryInterface } from '../repositories/farmer.repository.interface';
import { FarmRepositoryInterface } from '../repositories/farm.repository.interface';
import { CreateFarmerDTO, FarmerWebDTO } from '../dto/farmer.dto';
import { BadRequestError } from '@infra/errors/http_errors';
import { Document } from '@shared/valueObjects/document';
import { Either, left, right } from '@infra/either';
import { Farmer } from '../domains/farmer.domain';
import { FarmerMap } from '@main/maps/farmer.map';
import { CreateFarmDTO } from '../dto/farm.dto';
import { Crop } from '../domains/crop.domain';
import { Farm } from '../domains/farm.domain';
import { AppError } from '@infra/errors';

interface RequestInterface {
  user_id: string;
  farmer_id: string;
  name?: string;
  document?: string;
  farm_name?: string;
  city?: string;
  state?: string;
  total_area?: number;
  total_agricultural_area?: number;
  total_vegetation_area?: number;
  crops?: string[];
}

export class UpdateFarmService {
  private _farmRepository: FarmRepositoryInterface;
  private _farmerRepository: FarmerRepositoryInterface;
  private _userRepository: UserRepositoryInterface;

  private constructor(
    farmRepository: FarmRepositoryInterface,
    farmerRepository: FarmerRepositoryInterface,
    userRepository: UserRepositoryInterface,
  ) {
    this._userRepository = userRepository;
    this._farmRepository = farmRepository;
    this._farmerRepository = farmerRepository;
  }

  public static getInstance(
    farmRepository: FarmRepositoryInterface,
    farmerRepository: FarmerRepositoryInterface,
    userRepository: UserRepositoryInterface,
  ): UpdateFarmService {
    return new UpdateFarmService(farmRepository, farmerRepository, userRepository);
  }

  async execute(data: RequestInterface): Promise<Either<AppError, FarmerWebDTO>> {
    const user_resp = await this._userRepository.findOne({ id: data.user_id });

    if (user_resp.isLeft()) {
      return left(user_resp.value);
    }

    const user = user_resp.map((user) => user).value;

    if (!user) {
      return left(new BadRequestError('User not found'));
    }

    const farmer_resp = await this._farmerRepository.findOne({
      id: data.farmer_id,
      user_id: user.id,
    });

    const farmer = farmer_resp.map((farmer) => farmer).value;

    if (!farmer || farmer_resp.isLeft()) {
      return left(new BadRequestError('Farmer not found'));
    }

    const farm_resp = await this._farmRepository.findOne({ farmer_id: farmer.id });

    const farm = farm_resp.map((farm) => farm).value;

    if (!farm || farm_resp.isLeft()) {
      return left(new BadRequestError('Farm not found'));
    }

    const document_resp = data.document ? Document.create(data.document) : undefined;

    if (document_resp && document_resp.isLeft()) {
      return left(document_resp.value);
    }

    let crops: Crop[] = [];

    let crop_error = false;
    if (data.crops) {
      const crops_resp = await this._farmRepository.findCropByName(data.crops);

      const crops_value = crops_resp.map((crops) => crops).value || undefined;

      if (crops_resp.isLeft() || !crops_value) {
        crop_error = true;
      } else {
        crops = crops_value;
      }
    }

    if (crop_error) {
      return left(new BadRequestError('Crop not found'));
    }

    const document = document_resp
      ? document_resp.map((document) => document)
      : undefined;

    const farmer_dto: CreateFarmerDTO = {
      id: farmer.id,
      user_id: user.id,
      name: data.name || farmer.name,
      document: document || farmer.document_object,
    };

    const new_farmer = new Farmer(farmer_dto);

    const farm_dto: CreateFarmDTO = {
      id: farm.id,
      name: data.farm_name || farm.name,
      user_id: user.id,
      city: data.city || farm.city,
      state: data.state || farm.state,
      total_area: data.total_area || farm.total_area,
      total_agricultural_area:
        data.total_agricultural_area || farm.total_agricultural_area,
      total_vegetation_area: data.total_vegetation_area || farm.total_vegetation_area,
      crops: crops.length > 0 ? crops : farm.crops,
      farmer_id: new_farmer.id,
    };

    const new_farm = new Farm(farm_dto);

    if (!new_farm.isAreValid()) {
      return left(
        new BadRequestError(
          'Total area must be equal to the sum of agricultural area and vegetation area',
        ),
      );
    }

    const farmer_update_resp = await this._farmerRepository.update(farmer.id, new_farmer);

    if (farmer_update_resp.isLeft()) {
      return left(farmer_update_resp.value);
    }

    const farm_update_resp = await this._farmRepository.update(farm.id, new_farm);

    if (farm_update_resp.isLeft()) {
      return left(farm_update_resp.value);
    }

    const output = FarmerMap.domainToWeb(new_farmer, [new_farm]);

    return right(output);
  }
}
