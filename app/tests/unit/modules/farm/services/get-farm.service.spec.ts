import {
  mockFarmRepository,
  mockFarmerRepository,
  mockUserRepository,
} from '@tests/doubles/repositories/in-memory.repository';
import { GetFarmersService } from '@modules/farm/services/get-farmer.service';
import { Farmer } from '@modules/farm/domains/farmer.domain';
import { BadRequestError } from '@infra/errors/http_errors';
import { Crop } from '@modules/farm/domains/crop.domain';
import { Farm } from '@modules/farm/domains/farm.domain';
import { User } from '@modules/user/domains/user.domain';
import { Document } from '@shared/valueObjects/document';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

describe('Get farm service', () => {
  let getFarmersService: GetFarmersService;

  beforeEach(() => {
    getFarmersService = GetFarmersService.getInstance(
      mockFarmRepository,
      mockFarmerRepository,
      mockUserRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getFarmersService).toBeDefined();
  });

  it('should get a farm', async () => {
    const crop = new Crop({
      id: 'any_crop_id',
      name: 'Algodão',
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
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.index = rightResponse({
      data: [farm],
    });
    mockFarmerRepository.findOne = rightResponse(new SuccessfulResponse(farmer));
    const farmCreated = await getFarmersService.execute({
      user_id: user.id,
      farmer_id: farmer.id,
    });

    const resp = farmCreated.map((farm) => farm);

    expect(farmCreated.isRight()).toBeTruthy();
    expect(resp.document).toBe(farmer.document);
    expect(resp.farms[0].id).toBeDefined();
  });

  it('should not get a farm because user not exist', async () => {
    const crop = new Crop({
      id: 'any_crop_id',
      name: 'Algodão',
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
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(undefined));
    mockFarmRepository.index = rightResponse({
      data: [farm],
    });
    mockFarmerRepository.findOne = rightResponse(new SuccessfulResponse(farmer));
    const farmCreated = await getFarmersService.execute({
      user_id: user.id,
      farmer_id: farmer.id,
    });

    const resp = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(resp.message).toBe('User not found');
  });

  it('should not get a farm because farmer not exist', async () => {
    const crop = new Crop({
      id: 'any_crop_id',
      name: 'Algodão',
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
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.index = rightResponse({
      data: [farm],
    });
    mockFarmerRepository.findOne = rightResponse(new SuccessfulResponse(undefined));
    const farmCreated = await getFarmersService.execute({
      user_id: user.id,
      farmer_id: farmer.id,
    });

    const resp = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(resp.message).toBe('Farmer not found');
  });
});
