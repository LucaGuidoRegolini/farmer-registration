import { jwt_secret } from './global_env';

export const auth_config = {
  expireIn: '24h',
  secreteKey: jwt_secret || 'default',
};

export const password_salt = 10;

export const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
