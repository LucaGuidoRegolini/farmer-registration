import { FarmerRepository } from '@modules/farm/repositories/farmer.repository';
import { FarmRepository } from '@modules/farm/repositories/farm.repository';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { prismaMock } from '@tests/mocks/prisma';

export const mockUserRepository = UserRepository.getInstance(prismaMock);
export const mockFarmerRepository = FarmerRepository.getInstance(prismaMock);
export const mockFarmRepository = FarmRepository.getInstance(prismaMock);
