import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { AuthenticateUserService } from '../services/authentication.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class AuthenticateUserController implements WebControllerInterface {
  private _authenticateUserService: AuthenticateUserService;

  private constructor(authenticateUserService: AuthenticateUserService) {
    this._authenticateUserService = authenticateUserService;
  }

  public static getInstance(
    authenticateUserService: AuthenticateUserService,
  ): AuthenticateUserController {
    return new AuthenticateUserController(authenticateUserService);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { name, password } = request.body;

    const userOrError = await this._authenticateUserService.execute({
      name,
      password,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.ok(response));
  }
}
