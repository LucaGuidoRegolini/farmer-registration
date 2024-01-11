import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';

import { CreateFarmService } from '../services/create-farm.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class CreateFarmController implements WebControllerInterface {
  private _createFarmService: CreateFarmService;

  private constructor(createFarmService: CreateFarmService) {
    this._createFarmService = createFarmService;
  }

  public static getInstance(createFarmService: CreateFarmService): CreateFarmController {
    return new CreateFarmController(createFarmService);
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

    const farmOrError = await this._createFarmService.execute({
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

    return right(HttpResponse.created(response));
  }
}
