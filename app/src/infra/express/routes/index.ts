import { Router } from 'express';

import { NotFoundError } from '@infra/errors/http_errors';
import { v1Routes } from './v1';

const appRoutes = Router();

appRoutes.get('/', (_, res) => {
  res.json({
    project: 'farmer_registration_api',
    version: '1.0.0',
  });
});

appRoutes.get('/healt-service', (req, res) => {
  return res.status(200).json({
    success: {
      responseType: 'SUCCESS_REQUEST',
      message: 'The application is healthy.',
    },
  });
});

appRoutes.use('/v1', v1Routes);

appRoutes.all('*/*', (req, res) => {
  throw new NotFoundError(`Cannot found resource ${req.method} ${req.path}.`);
});

export { appRoutes };
