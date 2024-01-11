import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { UserMap } from '@main/maps/user.map';
import { UserWebDTO } from '../dto/user.dto';
import { AppError } from '@infra/errors';

interface RequestInterface {
  id: string;
}

export class GetUserService {
  private _userRepository: UserRepositoryInterface;

  private constructor(userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository;
  }

  public static getInstance(userRepository: UserRepositoryInterface): GetUserService {
    return new GetUserService(userRepository);
  }

  async execute(data: RequestInterface): Promise<Either<AppError, UserWebDTO>> {
    const userResp = await this._userRepository.findOne({ id: data.id });

    const user = userResp.map((user) => user).value;

    if (userResp.isLeft() || !user) {
      return left(new BadRequestError('User not found'));
    }

    return right(UserMap.domainToWeb(user));
  }
}
