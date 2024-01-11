/* eslint-disable @typescript-eslint/no-explicit-any */
import { Either } from '@infra/either';

import { AppError } from '@infra/errors';

export type HttpRequestParams = 'body' | 'params' | 'query' | 'headers' | 'user';

export type HttpRequestInterface = {
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  user: {
    user_id: string;
  };
};

export interface HttpResponseInterface {
  statusCode: number;
  body: any;
}

type ParamType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
export interface ParamPropsInterface {
  required?: boolean;
  type?: ParamType;
  valid?: any[];
  label?: string;
}

export interface RequestPropsInterface {
  [key: string]: ParamPropsInterface;
}

export interface HttpParamsInterface {
  extra_params?: boolean;
  body?: RequestPropsInterface;
  params?: RequestPropsInterface;
  query?: RequestPropsInterface;
  headers?: RequestPropsInterface;
}

export interface WebControllerInterface {
  handle(request: HttpRequestInterface): Promise<Either<AppError, HttpResponseInterface>>;
}
