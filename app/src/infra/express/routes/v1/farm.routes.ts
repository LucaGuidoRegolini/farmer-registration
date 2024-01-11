import {
  createFarmControllerFactory,
  deleteFarmControllerFactory,
  getFarmControllerFactory,
  getFarmDataControllerFactory,
  listFarmControllerFactory,
  updateFarmControllerFactory,
} from '@main/factories/farm_module.factory';
import {
  createFarmValidation,
  deleteFarmValidation,
  getFarmValidation,
  listFarmsValidation,
  updateFarmValidation,
} from '@modules/farm/validations';
import { userEnsureAuthenticated } from '@infra/express/middleware/user_ensure_authenticated';
import { adapterMiddleware } from '@main/adapters/express-middleware-adapter';
import { adaptRoute } from '@main/adapters/express-routes-adapter';
import { Router } from 'express';

const farmRoutes = Router();

farmRoutes.use(adapterMiddleware(userEnsureAuthenticated));

farmRoutes.post('/', createFarmValidation, adaptRoute(createFarmControllerFactory()));

farmRoutes.get('/', listFarmsValidation, adaptRoute(listFarmControllerFactory()));

farmRoutes.get('/dashboard', adaptRoute(getFarmDataControllerFactory()));

farmRoutes.put(
  '/:farmer_id',
  updateFarmValidation,
  adaptRoute(updateFarmControllerFactory()),
);

farmRoutes.delete(
  '/:farmer_id',
  deleteFarmValidation,
  adaptRoute(deleteFarmControllerFactory()),
);

farmRoutes.get('/:farmer_id', getFarmValidation, adaptRoute(getFarmControllerFactory()));

export { farmRoutes };
