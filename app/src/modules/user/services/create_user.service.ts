import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { JwtTokenObject } from '@main/interfaces/jwt_token.interface';
import { BadRequestError } from '@infra/errors/http_errors';
import { Either, left, right } from '@infra/either';
import { JSONWebToken } from '@shared/utils/jwt';
import { User } from '../domains/user.domain';
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

export class CreateUserService {
  private _userRepository: UserRepositoryInterface;

  private constructor(userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository;
  }

  public static getInstance(userRepository: UserRepositoryInterface): CreateUserService {
    return new CreateUserService(userRepository);
  }

  async execute(
    data: RequestInterface,
  ): Promise<Either<BadRequestError | AppError, ResponseInterface>> {
    const { name, password } = data;

    const user = User.create({
      name,
      password,
    });

    const userExists_resp = await this._userRepository.findOne({ name });
    const userExists = userExists_resp.isRight()
      ? userExists_resp.value.value
      : undefined;

    if (userExists) {
      return left(new BadRequestError('User already exists'));
    }

    const userCreated = await this._userRepository.create(user);

    if (userCreated.isLeft()) {
      return left(userCreated.value);
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
