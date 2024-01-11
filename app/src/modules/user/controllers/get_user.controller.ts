import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { GetUserService } from '../services/get_user.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class GetUserController implements WebControllerInterface {
  private _getUserService: GetUserService;

  private constructor(getUserService: GetUserService) {
    this._getUserService = getUserService;
  }

  public static getInstance(getUserService: GetUserService): GetUserController {
    return new GetUserController(getUserService);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { user_id } = request.user;

    const userOrError = await this._getUserService.execute({
      id: user_id,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.ok(response));
  }
}
