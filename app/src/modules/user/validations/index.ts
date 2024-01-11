import { celebrate, Joi, Segments } from 'celebrate';
import { password_regex } from '@configs/auth';

export const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    password: Joi.string().required().regex(password_regex),
  }),
});

export const authenticate_user_validation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    password: Joi.string().required(),
  }),
});
