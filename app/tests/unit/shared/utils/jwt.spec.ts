import { JSONWebToken } from '@shared/utils/jwt';

describe('jwt helper class', () => {
  it('should be create a jwt token valid', () => {
    const jwt_token = JSONWebToken.sign({ id: 'any_id' }, 'secret', '1d');

    const payload = JSONWebToken.verify(jwt_token, 'secret') as any;

    expect(payload.id).toEqual('any_id');
    expect(jwt_token).toBeDefined();
  });
});
