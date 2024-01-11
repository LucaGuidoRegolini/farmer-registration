import { AuthenticateUserController } from '@modules/user/controllers/authenticate_user.controller';
import { CreateUserController } from '@modules/user/controllers/create_user.controller';
import { AuthenticateUserService } from '@modules/user/services/authentication.service';
import { GetUserController } from '@modules/user/controllers/get_user.controller';
import { CreateUserService } from '@modules/user/services/create_user.service';
import { GetUserService } from '@modules/user/services/get_user.service';
import { userRepositoryFactory } from './repositories.factory';

export function createUserServiceFactory(): CreateUserService {
  return CreateUserService.getInstance(userRepositoryFactory());
}

export function getUserServiceFactory(): GetUserService {
  return GetUserService.getInstance(userRepositoryFactory());
}

export function authenticateUserServiceFactory(): AuthenticateUserService {
  return AuthenticateUserService.getInstance(userRepositoryFactory());
}

export function createUserControllerFactory(): CreateUserController {
  return CreateUserController.getInstance(createUserServiceFactory());
}

export function getUserControllerFactory(): GetUserController {
  return GetUserController.getInstance(getUserServiceFactory());
}

export function authenticateUserControllerFactory(): AuthenticateUserController {
  return AuthenticateUserController.getInstance(authenticateUserServiceFactory());
}
