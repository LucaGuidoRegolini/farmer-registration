import {
  HttpRequestInterface,
  HttpResponseInterface,
  WebControllerInterface,
} from '@main/interfaces/web_controller.interface';
import { http_client_code_errors } from '@configs/http_code';
import { HttpError } from '@infra/errors/http_errors';
import { Request, Response } from 'express';

export const adaptRoute = (controller: WebControllerInterface) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequestInterface = {
      body: request.body,
      params: request.params,
      query: request.query,
      headers: request.headers,
      user: request.user,
    };

    const httpResponse = await controller.handle(httpRequest);

    if (httpResponse.isLeft()) {
      if (httpResponse.value instanceof HttpError) {
        response.status(httpResponse.value.statusCode).json({
          error: httpResponse.value.message,
          type: httpResponse.value.type,
        });
      } else {
        response.status(http_client_code_errors.BAD_REQUEST_ERROR).json({
          error: httpResponse.value.message,
          type: httpResponse.value.type,
        });
      }
    }

    const resp = httpResponse.value as HttpResponseInterface;

    response.status(resp.statusCode).json(resp.body);
  };
};
