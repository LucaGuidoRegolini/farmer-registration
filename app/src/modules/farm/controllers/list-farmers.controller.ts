import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';

import { ListFarmersService } from '../services/list-farmers.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class ListFarmersController implements WebControllerInterface {
  private _listFarmersService: ListFarmersService;

  private constructor(listFarmersService: ListFarmersService) {
    this._listFarmersService = listFarmersService;
  }

  public static getInstance(
    listFarmersService: ListFarmersService,
  ): ListFarmersController {
    return new ListFarmersController(listFarmersService);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { user_id } = request.user;

    const { page } = request.query;

    const farmOrError = await this._listFarmersService.execute({
      user_id,
      page,
    });

    if (farmOrError.isLeft()) {
      return left(farmOrError.value);
    }

    const response = farmOrError.map((farm) => farm);

    return right(HttpResponse.ok(response));
  }
}
