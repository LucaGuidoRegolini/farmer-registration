import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { CreateUserService } from '../services/create_user.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class CreateUserController implements WebControllerInterface {
  private _createUserService: CreateUserService;

  private constructor(createUserService: CreateUserService) {
    this._createUserService = createUserService;
  }

  public static getInstance(createUserService: CreateUserService): CreateUserController {
    return new CreateUserController(createUserService);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { name, password } = request.body;

    const userOrError = await this._createUserService.execute({
      name,
      password,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const response = userOrError.map((user) => user);

    return right(HttpResponse.created(response));
  }
}
