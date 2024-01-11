import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';

import { FarmDataService } from '../services/farm-data.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class GetDataFarmController implements WebControllerInterface {
  private _farmDataService: FarmDataService;

  private constructor(farmDataService: FarmDataService) {
    this._farmDataService = farmDataService;
  }

  public static getInstance(farmDataService: FarmDataService): GetDataFarmController {
    return new GetDataFarmController(farmDataService);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { user_id } = request.user;

    const farmOrError = await this._farmDataService.execute({
      user_id,
    });

    if (farmOrError.isLeft()) {
      return left(farmOrError.value);
    }

    const response = farmOrError.map((farm) => farm);

    return right(HttpResponse.ok(response));
  }
}
