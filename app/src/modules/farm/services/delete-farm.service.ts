import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { FarmerRepositoryInterface } from '../repositories/farmer.repository.interface';
import { FarmRepositoryInterface } from '../repositories/farm.repository.interface';
import { Either, SuccessfulResponse, left, right } from '@infra/either';
import { BadRequestError } from '@infra/errors/http_errors';
import { AppError } from '@infra/errors';

interface RequestInterface {
  user_id: string;
  farmer_id: string;
}

export class DeleteFarmService {
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
  ): DeleteFarmService {
    return new DeleteFarmService(farmRepository, farmerRepository, userRepository);
  }

  async execute(
    data: RequestInterface,
  ): Promise<Either<AppError, SuccessfulResponse<undefined>>> {
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

    const farm_deleted = await this._farmRepository.delete(farm.id);

    if (farm_deleted.isLeft()) {
      return left(farm_deleted.value);
    }

    const farmer_deleted = await this._farmerRepository.delete(farmer.id);

    if (farmer_deleted.isLeft()) {
      return left(farmer_deleted.value);
    }

    return right(new SuccessfulResponse(undefined));
  }
}
