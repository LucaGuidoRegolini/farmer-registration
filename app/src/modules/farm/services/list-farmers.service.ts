import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { FarmerRepositoryInterface } from '../repositories/farmer.repository.interface';
import { FarmRepositoryInterface } from '../repositories/farm.repository.interface';
import { FarmerWithoutFarmsWebDTO } from '../dto/farmer.dto';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { FarmerMap } from '@main/maps/farmer.map';
import { AppError } from '@infra/errors';

interface RequestInterface {
  user_id: string;
  page?: number;
}

interface ResponseInterface {
  farmers: FarmerWithoutFarmsWebDTO[];
  total: number;
  page: number;
}

export class ListFarmersService {
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
  ): ListFarmersService {
    return new ListFarmersService(farmRepository, farmerRepository, userRepository);
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

    const farmer_list_resp = await this._farmerRepository.list({
      filter: { user_id: user.id },
      page: data.page,
      limit: 10,
    });

    const farmer_list = farmer_list_resp.map((farmer_list) => farmer_list);

    if (farmer_list_resp.isLeft()) {
      return left(farmer_list_resp.value);
    }

    const output = farmer_list.data.map((farmer) =>
      FarmerMap.domainToWebWithoutFarms(farmer),
    );

    return right({
      farmers: output,
      total: farmer_list.total,
      page: farmer_list.page,
    });
  }
}
