import { farmRoutes } from './farm.routes';
import { userRoutes } from './user.routes';
import { Router } from 'express';

const v1Routes = Router();

v1Routes.use('/user', userRoutes);
v1Routes.use('/farm', farmRoutes);

export { v1Routes };
