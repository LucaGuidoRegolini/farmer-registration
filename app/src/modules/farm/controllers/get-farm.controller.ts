import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';

import { GetFarmersService } from '../services/get-farmer.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class GetFarmController implements WebControllerInterface {
  private _getFarmersService: GetFarmersService;

  private constructor(listFarmersService: GetFarmersService) {
    this._getFarmersService = listFarmersService;
  }

  public static getInstance(listFarmersService: GetFarmersService): GetFarmController {
    return new GetFarmController(listFarmersService);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { user_id } = request.user;

    const { farmer_id } = request.params;

    const farmOrError = await this._getFarmersService.execute({
      user_id,
      farmer_id,
    });

    if (farmOrError.isLeft()) {
      return left(farmOrError.value);
    }

    const response = farmOrError.map((farm) => farm);

    return right(HttpResponse.ok(response));
  }
}
