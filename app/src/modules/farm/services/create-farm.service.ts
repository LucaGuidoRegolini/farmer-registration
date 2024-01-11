import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { FarmerRepositoryInterface } from '../repositories/farmer.repository.interface';
import { FarmRepositoryInterface } from '../repositories/farm.repository.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Document } from '@shared/valueObjects/document';
import { Either, left, right } from '@infra/either';
import { Farmer } from '../domains/farmer.domain';
import { FarmerMap } from '@main/maps/farmer.map';
import { FarmerWebDTO } from '../dto/farmer.dto';
import { Farm } from '../domains/farm.domain';
import { AppError } from '@infra/errors';

interface RequestInterface {
  user_id: string;
  name: string;
  document: string;
  farm_name: string;
  city: string;
  state: string;
  total_area: number;
  total_agricultural_area: number;
  total_vegetation_area: number;
  crops: string[];
}

export class CreateFarmService {
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
  ): CreateFarmService {
    return new CreateFarmService(farmRepository, farmerRepository, userRepository);
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

    const document_resp = Document.create(data.document);

    if (document_resp.isLeft()) {
      return left(document_resp.value);
    }

    const document = document_resp.map((document) => document);

    const farmer = Farmer.create({
      user_id: user.id,
      name: data.name,
      document,
    });

    const crops_resp = await this._farmRepository.findCropByName(data.crops);

    let crops = crops_resp.map((crops) => crops).value;

    if (crops_resp.isLeft()) {
      return left(crops_resp.value);
    }

    if (!crops) {
      crops = [];
    }

    const farm = Farm.create({
      name: data.farm_name,
      city: data.city,
      user_id: user.id,
      state: data.state,
      total_area: data.total_area,
      total_agricultural_area: data.total_agricultural_area,
      total_vegetation_area: data.total_vegetation_area,
      crops,
      farmer_id: farmer.id,
    });

    if (!farm.isAreValid()) {
      return left(
        new BadRequestError(
          'Total area must be equal to the sum of agricultural area and vegetation area',
        ),
      );
    }

    const farmer_resp = await this._farmerRepository.create(farmer);

    if (farmer_resp.isLeft()) {
      return left(farmer_resp.value);
    }

    const farm_resp = await this._farmRepository.create(farm);

    if (farm_resp.isLeft()) {
      return left(farm_resp.value);
    }

    const output = FarmerMap.domainToWeb(farmer, [farm]);

    return right(output);
  }
}
