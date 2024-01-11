import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { FarmerRepositoryInterface } from '../repositories/farmer.repository.interface';
import { FarmRepositoryInterface } from '../repositories/farm.repository.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { FarmerMap } from '@main/maps/farmer.map';
import { FarmerWebDTO } from '../dto/farmer.dto';
import { AppError } from '@infra/errors';

interface RequestInterface {
  user_id: string;
  farmer_id: string;
}

export class GetFarmersService {
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
  ): GetFarmersService {
    return new GetFarmersService(farmRepository, farmerRepository, userRepository);
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

    if (farmer_resp.isLeft() || !farmer) {
      return left(new BadRequestError('Farmer not found'));
    }

    const farms_resp = await this._farmRepository.index({
      filter: { farmer_id: farmer.id },
    });

    const farms = farms_resp.map((farms) => farms).data;

    if (farms_resp.isLeft()) {
      return left(farms_resp.value);
    }

    return right(FarmerMap.domainToWeb(farmer, farms));
  }
}
