import { HttpResponse } from '@shared/utils/httpResponse';

describe('http response class', () => {
  it('should be return valid http response', () => {
    const ok = HttpResponse.ok({
      name: 'any_name',
    });

    const created = HttpResponse.created({
      name: 'any_name',
    });

    const noResponse = HttpResponse.noResponse();

    expect(ok.statusCode).toBe(200);
    expect(ok.body).toEqual({
      name: 'any_name',
    });
    expect(created.statusCode).toBe(201);
    expect(noResponse.statusCode).toBe(204);
  });

  it('should be return bad request http response', () => {
    const badRequest = HttpResponse.badRequest({
      message: 'any_message',
    });

    const unauthorized = HttpResponse.unauthorized({
      message: 'any_message',
    });

    expect(badRequest.statusCode).toBe(400);
    expect(badRequest.body).toEqual({
      message: 'any_message',
    });

    expect(unauthorized.statusCode).toBe(401);
  });
});
