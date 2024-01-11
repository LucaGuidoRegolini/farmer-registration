import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { FarmRepositoryInterface } from '../repositories/farm.repository.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

interface RequestInterface {
  user_id: string;
}

interface ResponseInterface {
  total_farms: number;
  total_agricultural_area: number;
  total_vegetation_area: number;
  total_farm_area: number;
  state_percent: ToPropInterface;
  crop_percent: ToPropInterface;
  total_vegetation_area_percent: number;
  total_agricultural_area_percent: number;
}

interface ToPropInterface {
  [key: string]: number;
}

export class FarmDataService {
  private _farmRepository: FarmRepositoryInterface;
  private _userRepository: UserRepositoryInterface;

  private constructor(
    farmRepository: FarmRepositoryInterface,
    userRepository: UserRepositoryInterface,
  ) {
    this._userRepository = userRepository;
    this._farmRepository = farmRepository;
  }

  public static getInstance(
    farmRepository: FarmRepositoryInterface,
    userRepository: UserRepositoryInterface,
  ): FarmDataService {
    return new FarmDataService(farmRepository, userRepository);
  }

  async execute(data: RequestInterface): Promise<Either<AppError, ResponseInterface>> {
    const user_resp = await this._userRepository.findOne({ id: data.user_id });

    if (user_resp.isLeft()) {
      return left(user_resp.value);
    }

    const user = user_resp.map((user) => user).value;

    if (!user) {
      return left(new BadRequestError('User not found'));
    }

    const farms_resp = await this._farmRepository.index({ filter: { user_id: user.id } });

    if (farms_resp.isLeft()) {
      return left(farms_resp.value);
    }

    const farms = farms_resp.map((farms) => farms).data;

    const total_farms = farms.length;

    let total_crops = 0;
    let total_agricultural_area = 0;
    let total_vegetation_area = 0;
    let total_farm_area = 0;

    const farm_to_stage: ToPropInterface = {};
    const farm_to_crop: ToPropInterface = {};

    farms.map((farm) => {
      farm_to_stage[farm.state] = farm_to_stage[farm.state]
        ? farm_to_stage[farm.state] + 1
        : 1;

      farm.crops.map((crop) => {
        farm_to_crop[crop.name] = farm_to_crop[crop.name]
          ? farm_to_crop[crop.name] + 1
          : 1;
        total_crops += 1;
      });

      total_agricultural_area += farm.total_agricultural_area;
      total_vegetation_area += farm.total_vegetation_area;
      total_farm_area += farm.total_area;
    });

    const state_percent: ToPropInterface = {};

    Object.keys(farm_to_stage).map((key) => {
      state_percent[key] = (farm_to_stage[key] / total_farms) * 100;
    });

    const crop_percent: ToPropInterface = {};
    Object.keys(farm_to_crop).map((key) => {
      crop_percent[key] = (farm_to_crop[key] / total_crops) * 100;
    });

    const total_vegetation_area_percent = (total_vegetation_area / total_farm_area) * 100;
    const total_agricultural_area_percent =
      (total_agricultural_area / total_farm_area) * 100;

    return right({
      total_farms,
      total_agricultural_area,
      total_vegetation_area,
      total_farm_area,
      state_percent,
      crop_percent,
      total_vegetation_area_percent,
      total_agricultural_area_percent,
    });
  }
}
