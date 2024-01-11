import jwt from 'jsonwebtoken';

export class JSONWebToken {
  static verify(token: string, secretKey: string): object | string {
    return jwt.verify(token, secretKey);
  }

  static sign(payload: object, secretKey: string, expiresIn: string): string {
    return jwt.sign(payload, secretKey, { expiresIn });
  }
}
