import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { JwtTokenObject } from '@main/interfaces/jwt_token.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { JSONWebToken } from '@shared/utils/jwt';
import { UserMap } from '@main/maps/user.map';
import { UserWebDTO } from '../dto/user.dto';
import { auth_config } from '@configs/auth';
import { AppError } from '@infra/errors';

interface RequestInterface {
  name: string;
  password: string;
}

interface ResponseInterface {
  user: UserWebDTO;
  token: string;
}

export class AuthenticateUserService {
  private _userRepository: UserRepositoryInterface;

  private constructor(userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository;
  }

  public static getInstance(
    userRepository: UserRepositoryInterface,
  ): AuthenticateUserService {
    return new AuthenticateUserService(userRepository);
  }

  async execute(data: RequestInterface): Promise<Either<AppError, ResponseInterface>> {
    const { name, password } = data;

    const userResp = await this._userRepository.findOne({ name });

    const user = userResp.map((user) => user).value;

    if (userResp.isLeft() || !user) {
      return left(new BadRequestError('User not found'));
    }

    if (!user.comparePassword(password)) {
      return left(new BadRequestError('Password invalid'));
    }

    const token_payload: JwtTokenObject = {
      user_id: user.id,
    };

    const token = JSONWebToken.sign(
      token_payload,
      auth_config.secreteKey,
      auth_config.expireIn,
    );

    return right({
      user: UserMap.domainToWeb(user),
      token,
    });
  }
}
