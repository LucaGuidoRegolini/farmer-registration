/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

import { HttpError, HttpErrorInterface } from '@infra/errors/http_errors';
import { DomainError } from '@infra/errors/domain_error';
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
          messageString = `O campo ${context.label} é obrigatório.`;
          break;
        case 'string.base':
          messageString = `O campo ${context.label} deve ser do tipo texto.`;
          break;
        case 'string.empty':
          messageString = `O campo ${context.label} não pode ser um texto vazio.`;
          break;
        case 'string.min':
          messageString = `O campo ${context.label} não pode ser menor que ${context.limit} caracteres.`;
          break;
        case 'string.max':
          messageString = `O campo ${context.label} não pode ser maior que ${context.limit} caracteres.`;
          break;
        case 'string.email':
          messageString = `O campo ${context.label} deve ser um email válido.`;
          break;
        case 'number.base':
          messageString = `O campo ${context.label} deve ser do tipo número.`;
          break;
        case 'number.min':
          messageString = `O campo ${context.label} não pode ser menor que ${context.limit}.`;
          break;
        case 'number.max':
          messageString = `O campo ${context.label} não pode ser maior que ${context.limit}.`;
          break;
        case 'array.base':
          messageString = `O campo ${context.label} deve ser do tipo array.`;
          break;
        case 'array.empty':
          messageString = `O campo ${context.label} não pode ser vazio.`;
          break;
        case 'array.min':
          messageString = `O campo ${context.label} não pode ter um tamanho menor que ${context.limit}.`;
          break;
        case 'array.max':
          messageString = `O campo ${context.label} não podeer um tamanho maior que ${context.limit}.`;
          break;
        case 'document.cpf':
          messageString = `O CPF é inválido.`;
          break;
        case 'object.unknown':
          messageString = `${context.label} não é um campo válido.`;
          break;

        case 'document.invalid':
          messageString = `O ${context.label} é invalido.`;
          break;
        case 'cropType.invalid':
          messageString = `O ${context.label} é invalido.`;
          break;
        default:
          messageString = `Aconteceu um erro tente novamente mais tarde. `;
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
