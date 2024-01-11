import { HttpResponseInterface } from '@main/interfaces/web_controller.interface';
import { http_client_code_errors, http_success_code } from '@configs/http_code';

export class HttpResponse {
  static ok(data: unknown): HttpResponseInterface {
    return {
      statusCode: http_success_code.OK,
      body: data,
    };
  }

  static noResponse(): HttpResponseInterface {
    return {
      statusCode: http_success_code.NO_CONTENT,
      body: null,
    };
  }

  static created(data: unknown): HttpResponseInterface {
    return {
      statusCode: http_success_code.CREATED,
      body: data,
    };
  }

  static badRequest(data: unknown): HttpResponseInterface {
    return {
      statusCode: http_client_code_errors.BAD_REQUEST_ERROR,
      body: data,
    };
  }

  static unauthorized(data: unknown): HttpResponseInterface {
    return {
      statusCode: http_client_code_errors.UNAUTHORIZED_ERROR,
      body: data,
    };
  }
}
