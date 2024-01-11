import { HttpRequestInterface } from '@main/interfaces/web_controller.interface';
import { MiddlewareInterface } from '@main/interfaces/middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { SuccessfulResponse } from '@infra/either';

export const adapterMiddleware = <T>(middleware: MiddlewareInterface<T>, param?: T) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const httpRequest: HttpRequestInterface = {
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
      user: request.user,
    };

    const httpResponse = await middleware.handler(httpRequest, param);

    if (httpResponse.isLeft()) {
      throw httpResponse.value;
    }

    const resp = httpResponse.map((value) => {
      return value;
    });

    if (!(resp instanceof SuccessfulResponse)) {
      Object.assign(request, resp);
    }

    next();
  };
};
