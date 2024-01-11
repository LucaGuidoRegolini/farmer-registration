import {
  ExtraRequestInterface,
  MiddlewareInterface,
} from '@main/interfaces/middleware.interface';
import { HttpRequestInterface } from '@main/interfaces/web_controller.interface';
import { InvalidTokenError, UnauthorizedError } from '@infra/errors/http_errors';
import { Either, SuccessfulResponse, left, right } from '@infra/either';
import { TokenDecoded } from '@main/interfaces/jwt_token.interface';
import { auth_config } from '@configs/auth';
import { JSONWebToken } from '@utils/jwt';
import { AppError } from '@infra/errors';

export class UserEnsureAuthenticated implements MiddlewareInterface<any> {
  private static instance: UserEnsureAuthenticated;

  private constructor() {}

  public static getInstance(): UserEnsureAuthenticated {
    if (!UserEnsureAuthenticated.instance) {
      UserEnsureAuthenticated.instance = new UserEnsureAuthenticated();
    }

    return UserEnsureAuthenticated.instance;
  }

  public async handler(
    req: HttpRequestInterface,
  ): Promise<Either<AppError, ExtraRequestInterface | SuccessfulResponse<boolean>>> {
    if (!req.headers.authorization) {
      return left(new UnauthorizedError('Token not provided'));
    }

    const [bearer, token] = req.headers.authorization.split(' ');

    if (bearer.toLowerCase() !== 'bearer' || !token || token.split('.').length !== 3) {
      return left(
        new InvalidTokenError(
          'The custom token format is incorrect. Please check the documentation.',
        ),
      );
    }

    try {
      const tokenDecoded = JSONWebToken.verify(
        token,
        auth_config.secreteKey,
      ) as TokenDecoded;

      req.user = {
        user_id: tokenDecoded.user_id,
      };
    } catch (error) {
      return left(new InvalidTokenError('This token is inspired'));
    }

    return right({
      user: req.user,
    });
  }
}

export const userEnsureAuthenticated = UserEnsureAuthenticated.getInstance();
