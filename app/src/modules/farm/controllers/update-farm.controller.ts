import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';

import { UpdateFarmService } from '../services/update-farm.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class UpdateFarmController implements WebControllerInterface {
  private _updateFarmService: UpdateFarmService;

  private constructor(updateFarmService: UpdateFarmService) {
    this._updateFarmService = updateFarmService;
  }

  public static getInstance(updateFarmService: UpdateFarmService): UpdateFarmController {
    return new UpdateFarmController(updateFarmService);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { document, name, farm } = request.body;

    const {
      farm_name,
      total_area,
      total_agricultural_area,
      total_vegetation_area,
      city,
      crops,
      state,
    } = farm;

    const { user_id } = request.user;

    const { farmer_id } = request.params;

    const farmOrError = await this._updateFarmService.execute({
      farmer_id,
      city,
      crops,
      document,
      farm_name,
      name,
      state,
      total_agricultural_area,
      total_area,
      total_vegetation_area,
      user_id,
    });

    if (farmOrError.isLeft()) {
      return left(farmOrError.value);
    }

    const response = farmOrError.map((farm) => farm);

    return right(HttpResponse.ok(response));
  }
}
