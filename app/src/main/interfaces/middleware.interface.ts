import { HttpRequestInterface } from './web_controller.interface';
import { Either, SuccessfulResponse } from '@infra/either';
import { AppError } from '@infra/errors';

export interface ExtraRequestInterface {
  [key: string]: any;
}

export interface MiddlewareInterface<T> {
  handler(
    req: HttpRequestInterface,
    param?: T,
  ): Promise<Either<AppError, ExtraRequestInterface | SuccessfulResponse<boolean>>>;
}
