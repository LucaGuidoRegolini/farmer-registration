import { RepositoryInterface } from '@shared/repository/repository.interface';
import { Either, SuccessfulResponse } from '@infra/either';
import { Crop } from '../domains/crop.domain';
import { Farm } from '../domains/farm.domain';
import { AppError } from '@infra/errors';

export interface FarmRepositoryInterface extends RepositoryInterface<Farm> {
  /**
   * @description Finds a crop by name
   * @param name Crop name
   */
  findCropByName(
    name: string | string[],
  ): Promise<Either<AppError, SuccessfulResponse<Crop[] | undefined>>>;
}
