/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

import { DomainError } from '@infra/errors/domain_error';
import { HttpError, HttpErrorInterface } from '@infra/errors/http_errors';
import { CelebrateError } from 'celebrate';
import { Logger } from './logger';

type IExpressReqResLoggerParams = { logger: winston.Logger };

type IExpressRequestLoggerResponse = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

type IExpressErrorLogger = (
  rr: HttpErrorInterface,
  req: Request,
  _res: Response,
  _: NextFunction,
) => Response;

type IHttpLogger = {
  req_logger: (param: IExpressReqResLoggerParams) => IExpressRequestLoggerResponse;
  err_logger: (param: IExpressReqResLoggerParams) => IExpressErrorLogger;
};

function expressRequestLogger(
  opts: IExpressReqResLoggerParams,
): IExpressRequestLoggerResponse {
  const { logger } = opts;

  return (req: Request, res: Response, next: NextFunction): void => {
    function onResDone(err: Error) {
      res.removeListener('finish', onResDone);
      res.removeListener('error', onResDone);
    }
    logger.info(
      `handled ${req.method} ${req.path}. body ${JSON.stringify(
        req.body,
      )} query ${JSON.stringify(req.query)}`,
    );
    res.on('finish', onResDone);
    res.on('error', onResDone);
    next();
  };
}

function expressErrorLogger(opts: IExpressReqResLoggerParams): IExpressErrorLogger {
  return (
    err: HttpErrorInterface,
    request: Request,
    response: Response,
    _: NextFunction,
  ): Response => {
    if (err instanceof HttpError) {
      Logger.error(
        `${err.statusCode} - ${err.message} - ${request.originalUrl} - ${
          request.method
        } - ${request.ip} - body: ${JSON.stringify(
          request.body,
        )} - params: ${JSON.stringify(request.params)} - query: ${JSON.stringify(
          request.query,
        )} - user: ${JSON.stringify(request.user)} - date: ${new Date()}`,
      );

      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    if (err instanceof CelebrateError) {
      Logger.error(
        `${400} - ${err.details.values().next().value.details[0].message} - ${
          request.originalUrl
        } - ${request.method} - ${request.ip} - body: ${JSON.stringify(
          request.body,
        )} - params: ${JSON.stringify(request.params)} - query: ${JSON.stringify(
          request.query,
        )} - user: ${JSON.stringify(request.user)} - date: ${new Date()}`,
      );

      let messageString;
      const { type, context } = err.details.values().next().value.details[0];

      switch (type) {
        case 'any.required':
          messageString = `The field ${context.label} is mandatory.`;
          break;
        case 'string.base':
          messageString = `The field ${context.label} must be of text type.`;
          break;
        case 'string.empty':
          messageString = `The field ${context.label} cannot be an empty text.`;
          break;
        case 'string.min':
          messageString = `The field ${context.label} cannot be less than ${context.limit} characters.`;
          break;
        case 'string.max':
          messageString = `The field ${context.label} cannot be more than ${context.limit} characters.`;
          break;
        case 'string.email':
          messageString = `The field ${context.label} must be a valid email address.`;
          break;
        case 'number.base':
          messageString = `The field ${context.label} must be of numeric type.`;
          break;
        case 'number.min':
          messageString = `The field ${context.label} cannot be less than ${context.limit}.`;
          break;
        case 'number.max':
          messageString = `The field ${context.label} cannot be greater than ${context.limit}.`;
          break;
        case 'array.base':
          messageString = `The field ${context.label} must be of array type.`;
          break;
        case 'array.empty':
          messageString = `The field ${context.label} cannot be empty.`;
          break;
        case 'array.min':
          messageString = `The field ${context.label} cannot have a size smaller than ${context.limit}.`;
          break;
        case 'array.max':
          messageString = `The field ${context.label} cannot have a size greater than ${context.limit}.`;
          break;
        case 'document.cpf':
          messageString = `The CPF (Brazilian ID) is invalid.`;
          break;
        case 'object.unknown':
          messageString = `${context.label} is not a valid field.`;
          break;

        case 'document.invalid':
          messageString = `${context.label} is not a valid document.`;
          break;
        case 'cropType.invalid':
          messageString = `${context.label} is not a valid plantation.`;
          break;
        default:
          messageString = `An error occurred. Please try again later.`;
          break;
      }

      return response.status(400).json({
        status: 'error',
        message: messageString,
      });
    }

    if (err instanceof DomainError) {
      return response.status(400).json({
        status: 'error',
        message: err.message,
      });
    }

    Logger.error(
      `${500} - ${err.message} - ${request.originalUrl} - ${request.method} - ${
        request.ip
      } - body: ${JSON.stringify(request.body)} - params: ${JSON.stringify(
        request.params,
      )} - query: ${JSON.stringify(request.query)} - user: ${JSON.stringify(
        request.user,
      )} - date: ${new Date()}`,
    );

    return response.status(500).json({
      status: 'error',
      message: `Server error: ${err.message}`,
    });
  };
}

export const httpLogger = {
  err_logger: expressErrorLogger,
  req_logger: expressRequestLogger,
} as IHttpLogger;
