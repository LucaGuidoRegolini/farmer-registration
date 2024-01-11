import {
  farmRepositoryFactory,
  farmerRepositoryFactory,
  userRepositoryFactory,
} from './repositories.factory';
import { GetDataFarmController } from '@modules/farm/controllers/get-data-farm.controller';
import { ListFarmersController } from '@modules/farm/controllers/list-farmers.controller';
import { CreateFarmController } from '@modules/farm/controllers/create-farm.controller';
import { DeleteFarmController } from '@modules/farm/controllers/delete-farm.controller';
import { UpdateFarmController } from '@modules/farm/controllers/update-farm.controller';
import { GetFarmController } from '@modules/farm/controllers/get-farm.controller';
import { ListFarmersService } from '@modules/farm/services/list-farmers.service';
import { CreateFarmService } from '@modules/farm/services/create-farm.service';
import { DeleteFarmService } from '@modules/farm/services/delete-farm.service';
import { UpdateFarmService } from '@modules/farm/services/update-farm.service';
import { GetFarmersService } from '@modules/farm/services/get-farmer.service';
import { FarmDataService } from '@modules/farm/services/farm-data.service';

export function createFarmServiceFactory() {
  return CreateFarmService.getInstance(
    farmRepositoryFactory(),
    farmerRepositoryFactory(),
    userRepositoryFactory(),
  );
}

export function deleteFarmServiceFactory(): DeleteFarmService {
  return DeleteFarmService.getInstance(
    farmRepositoryFactory(),
    farmerRepositoryFactory(),
    userRepositoryFactory(),
  );
}

export function getFarmServiceFactory(): GetFarmersService {
  return GetFarmersService.getInstance(
    farmRepositoryFactory(),
    farmerRepositoryFactory(),
    userRepositoryFactory(),
  );
}

export function updateFarmServiceFactory(): UpdateFarmService {
  return UpdateFarmService.getInstance(
    farmRepositoryFactory(),
    farmerRepositoryFactory(),
    userRepositoryFactory(),
  );
}

export function listFarmServiceFactory(): ListFarmersService {
  return ListFarmersService.getInstance(
    farmRepositoryFactory(),
    farmerRepositoryFactory(),
    userRepositoryFactory(),
  );
}

export function farmDataServicesFactory(): FarmDataService {
  return FarmDataService.getInstance(farmRepositoryFactory(), userRepositoryFactory());
}

export function createFarmControllerFactory(): CreateFarmController {
  return CreateFarmController.getInstance(createFarmServiceFactory());
}

export function deleteFarmControllerFactory(): DeleteFarmController {
  return DeleteFarmController.getInstance(deleteFarmServiceFactory());
}

export function getFarmControllerFactory(): GetFarmController {
  return GetFarmController.getInstance(getFarmServiceFactory());
}

export function updateFarmControllerFactory(): UpdateFarmController {
  return UpdateFarmController.getInstance(updateFarmServiceFactory());
}

export function listFarmControllerFactory(): ListFarmersController {
  return ListFarmersController.getInstance(listFarmServiceFactory());
}

export function getFarmDataControllerFactory(): GetDataFarmController {
  return GetDataFarmController.getInstance(farmDataServicesFactory());
}
