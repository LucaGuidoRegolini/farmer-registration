import { http_client_code_errors, http_server_code_errors } from '@configs/http_code';
import { AppError, ErrorInterface } from '.';

export interface HttpErrorInterface extends ErrorInterface {
  status?: number;
}

export abstract class HttpError extends AppError {
  private _statusCode: number;

  constructor({ name, message, status = 400, type = 'HTTP_ERROR' }: HttpErrorInterface) {
    super({
      name,
      message,
      type,
    });

    this._statusCode = status;
  }

  public get statusCode(): number {
    return this._statusCode;
  }
}

export class InvalidTokenError extends HttpError {
  constructor(message: string) {
    super({
      name: 'InvalidTokenError',
      message,
      status: http_client_code_errors.UNAUTHORIZED_ERROR,
      type: 'INVALID_TOKEN_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super({
      name: 'BadRequestError',
      message,
      status: http_client_code_errors.BAD_REQUEST_ERROR,
      type: 'BAD_REQUEST_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super({
      name: 'UnauthorizedError',
      message,
      status: http_client_code_errors.UNAUTHORIZED_ERROR,
      type: 'UNAUTHORIZED_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super({
      name: 'NotFoundError',
      message,
      status: http_client_code_errors.NOT_FOUND_ERROR,
      type: 'NOT_FOUND_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DuplicateError extends HttpError {
  constructor(message: string) {
    super({
      name: 'DuplicateError',
      message,
      status: http_client_code_errors.CONFLICT_ERROR,
      type: 'DUPLICATE_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConcurrencyError extends HttpError {
  constructor(message: string) {
    super({
      name: 'ConcurrencyError',
      message,
      status: http_client_code_errors.CONFLICT_ERROR,
      type: 'CONCURRENCY_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MissingRequestError extends HttpError {
  constructor(message: string) {
    super({
      name: 'MissingRequestError',
      message,
      status: http_client_code_errors.BAD_REQUEST_ERROR,
      type: 'MISSING_REQUEST_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string) {
    super({
      name: 'InternalServerError',
      message,
      status: http_server_code_errors.INTERNAL_SERVER_ERROR,
      type: 'INTERNAL_SERVER_ERROR',
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
