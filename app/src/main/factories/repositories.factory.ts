import { FarmerRepositoryInterface } from '@modules/farm/repositories/farmer.repository.interface';
import { FarmRepositoryInterface } from '@modules/farm/repositories/farm.repository.interface';
import { UserRepositoryInterface } from '@modules/user/repositories/user.repository.interface';
import { FarmerRepository } from '@modules/farm/repositories/farmer.repository';
import { FarmRepository } from '@modules/farm/repositories/farm.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { ConnectionDb } from '@infra/database/connection';

const prisma = ConnectionDb.getPrisma();

export function userRepositoryFactory(): UserRepositoryInterface {
  return UserRepository.getInstance(prisma);
}

export function farmerRepositoryFactory(): FarmerRepositoryInterface {
  return FarmerRepository.getInstance(prisma);
}

export function farmRepositoryFactory(): FarmRepositoryInterface {
  return FarmRepository.getInstance(prisma);
}
