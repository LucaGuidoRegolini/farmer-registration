import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';

import { DeleteFarmService } from '../services/delete-farm.service';
import { HttpResponse } from '@shared/utils/httpResponse';
import { Either, left, right } from '@infra/either';
import { AppError } from '@infra/errors';

export class DeleteFarmController implements WebControllerInterface {
  private _deleteFarmService: DeleteFarmService;

  private constructor(deleteFarmService: DeleteFarmService) {
    this._deleteFarmService = deleteFarmService;
  }

  public static getInstance(deleteFarmService: DeleteFarmService): DeleteFarmController {
    return new DeleteFarmController(deleteFarmService);
  }

  async handle(
    request: HttpRequestInterface,
  ): Promise<Either<AppError, HttpResponseInterface>> {
    const { user_id } = request.user;

    const { farmer_id } = request.params;

    const farmOrError = await this._deleteFarmService.execute({
      farmer_id,
      user_id,
    });

    if (farmOrError.isLeft()) {
      return left(farmOrError.value);
    }

    return right(HttpResponse.noResponse());
  }
}
