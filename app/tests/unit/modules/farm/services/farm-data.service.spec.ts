import {
  mockFarmRepository,
  mockUserRepository,
} from '@tests/doubles/repositories/in-memory.repository';
import { FarmDataService } from '@modules/farm/services/farm-data.service';
import { Farmer } from '@modules/farm/domains/farmer.domain';
import { BadRequestError } from '@infra/errors/http_errors';
import { Crop } from '@modules/farm/domains/crop.domain';
import { Farm } from '@modules/farm/domains/farm.domain';
import { User } from '@modules/user/domains/user.domain';
import { Document } from '@shared/valueObjects/document';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

describe('Data farm service', () => {
  let farmDataService: FarmDataService;

  beforeEach(() => {
    farmDataService = FarmDataService.getInstance(mockFarmRepository, mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(farmDataService).toBeDefined();
  });

  it('should get data from all farms', async () => {
    const crop = new Crop({
      id: 'any_crop_id',
      name: 'Algodão',
    });

    const crop_new = new Crop({
      id: 'any_new_crop_id',
      name: 'Café',
    });

    const user = new User({
      id: 'any_user_id',
      name: 'any_name',
      password: 'any_password',
    });

    const farmer = new Farmer({
      id: 'any_farmer_id',
      name: 'any_name',
      document: Document.create('800.815.070-03').value as Document,
      user_id: user.id,
    });

    const first_farm = new Farm({
      id: 'any_farm_id_1',
      name: 'any_farm_name',
      city: 'any_city',
      state: 'any_state',
      total_area: 20,
      total_agricultural_area: 10,
      total_vegetation_area: 10,
      user_id: user.id,
      crops: [crop],
      farmer_id: farmer.id,
    });

    const second_farm = new Farm({
      id: 'any_farm_id_2',
      name: 'any_farm_name',
      city: 'any_city',
      state: 'any_state',
      total_area: 20,
      total_agricultural_area: 10,
      total_vegetation_area: 10,
      user_id: user.id,
      crops: [crop],
      farmer_id: farmer.id,
    });

    const third_farm = new Farm({
      id: 'any_farm_id_3',
      name: 'any_farm_name',
      city: 'any_city',
      state: 'any_state',
      total_area: 20,
      total_agricultural_area: 10,
      total_vegetation_area: 10,
      user_id: user.id,
      crops: [crop],
      farmer_id: farmer.id,
    });

    mockFarmRepository.findCropByName = rightResponse(new SuccessfulResponse(crop));
    mockFarmRepository.findCropByName = rightResponse(new SuccessfulResponse(crop_new));
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.index = rightResponse({
      data: [first_farm, second_farm, third_farm],
    });
    const farmData = await farmDataService.execute({
      user_id: user.id,
    });

    const resp = farmData.map((farm) => farm);

    expect(farmData.isRight()).toBeTruthy();
    expect(resp.total_farms).toBe(3);
    expect(resp.total_agricultural_area_percent).toBe(50);
  });

  it('should not get data from all farms because user dont exist', async () => {
    const crop = new Crop({
      id: 'any_crop_id',
      name: 'Algodão',
    });

    const crop_new = new Crop({
      id: 'any_new_crop_id',
      name: 'Café',
    });

    const user = new User({
      id: 'any_user_id',
      name: 'any_name',
      password: 'any_password',
    });

    const farmer = new Farmer({
      id: 'any_farmer_id',
      name: 'any_name',
      document: Document.create('800.815.070-03').value as Document,
      user_id: user.id,
    });

    const farm = new Farm({
      id: 'any_farm_id',
      name: 'any_farm_name',
      city: 'any_city',
      state: 'any_state',
      total_area: 20,
      total_agricultural_area: 10,
      total_vegetation_area: 10,
      user_id: user.id,
      crops: [crop],
      farmer_id: farmer.id,
    });

    mockFarmRepository.findCropByName = rightResponse(new SuccessfulResponse(crop));
    mockFarmRepository.findCropByName = rightResponse(new SuccessfulResponse(crop_new));
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(undefined));
    mockFarmRepository.index = rightResponse({
      data: [farm],
    });
    const farmData = await farmDataService.execute({
      user_id: user.id,
    });

    const resp = farmData.value as BadRequestError;

    expect(farmData.isLeft()).toBeTruthy();
    expect(resp.message).toBe('User not found');
  });
});
