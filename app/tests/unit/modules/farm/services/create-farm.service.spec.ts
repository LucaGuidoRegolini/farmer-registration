import {
  mockFarmRepository,
  mockFarmerRepository,
  mockUserRepository,
} from '@tests/doubles/repositories/in-memory.repository';
import { CreateFarmService } from '@modules/farm/services/create-farm.service';
import { InvalidDocumentError } from '@infra/errors/domain_error';
import { Farmer } from '@modules/farm/domains/farmer.domain';
import { BadRequestError } from '@infra/errors/http_errors';
import { Crop } from '@modules/farm/domains/crop.domain';
import { Farm } from '@modules/farm/domains/farm.domain';
import { User } from '@modules/user/domains/user.domain';
import { Document } from '@shared/valueObjects/document';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

describe('Create farm service', () => {
  let createFarmService: CreateFarmService;

  beforeEach(() => {
    createFarmService = CreateFarmService.getInstance(
      mockFarmRepository,
      mockFarmerRepository,
      mockUserRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createFarmService).toBeDefined();
  });

  it('should not create a farm because user not exist', async () => {
    const farm = {
      name: 'any_name',
      city: 'any_city',
      state: 'any_state',
      crops: [],
      document: '571.678.700-21',
      farm_name: 'any_farm_name',
      total_agricultural_area: 10,
      total_area: 10,
      user_id: 'any_user_id',
      total_vegetation_area: 10,
    };

    const farmCreated = await createFarmService.execute(farm);

    const new_farm = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(new_farm).toBeInstanceOf(BadRequestError);
    expect(new_farm.message).toBe('User not found');
  });

  it('should not create a farm because document is invalid', async () => {
    const farm = {
      name: 'any_name',
      city: 'any_city',
      state: 'any_state',
      crops: [],
      document: '570.678.700-21',
      farm_name: 'any_farm_name',
      total_agricultural_area: 10,
      total_area: 20,
      user_id: 'any_user_id',
      total_vegetation_area: 10,
    };

    const user = new User({
      id: 'any_user_id',
      name: 'any_name',
      password: 'any_password',
    });

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const farmCreated = await createFarmService.execute(farm);

    const new_farm = farmCreated.value as InvalidDocumentError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(new_farm).toBeInstanceOf(InvalidDocumentError);
    expect(new_farm.message).toBe('Invalid document');
  });

  it('should not create a farm because area is invalid', async () => {
    const farm_data = {
      name: 'any_name',
      city: 'any_city',
      state: 'any_state',
      crops: [],
      document: '571.678.700-21',
      farm_name: 'any_farm_name',
      total_agricultural_area: 10,
      total_area: 10,
      user_id: 'any_user_id',
      total_vegetation_area: 10,
    };

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

    mockFarmRepository.findCropByName = rightResponse(new SuccessfulResponse(crop));
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.create = rightResponse(new SuccessfulResponse(farm));
    mockFarmerRepository.create = rightResponse(new SuccessfulResponse(farmer));

    const farmCreated = await createFarmService.execute(farm_data);

    const new_farm = farmCreated.value as BadRequestError;

    console.log(new_farm);

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(new_farm).toBeInstanceOf(BadRequestError);
    expect(new_farm.message).toBe(
      'Total area must be equal to the sum of agricultural area and vegetation area',
    );
  });

  it('should create a farm', async () => {
    const farm_data = {
      name: 'any_name',
      city: 'any_city',
      state: 'any_state',
      crops: ['Algodão'],
      document: '571.678.700-21',
      farm_name: 'any_farm_name',
      total_agricultural_area: 10,
      total_area: 20,
      user_id: 'any_user_id',
      total_vegetation_area: 10,
    };

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

    mockFarmRepository.findCropByName = rightResponse(new SuccessfulResponse(crop));
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.create = rightResponse(new SuccessfulResponse(farm));
    mockFarmerRepository.create = rightResponse(new SuccessfulResponse(farmer));
    const farmCreated = await createFarmService.execute(farm_data);

    const new_farm = farmCreated.map((farm) => farm);

    expect(farmCreated.isRight()).toBeTruthy();
    expect(new_farm.document).toBe(farm_data.document);
    expect(new_farm.farms[0].id).toBeDefined();
    expect(new_farm.farms[0].crops).toBe(crop);
    expect(new_farm.farms[0].name).toBe(farm_data.farm_name);
    expect(new_farm.farms[0].city).toBe(farm_data.city);
  });

  it('should create a farm without crops', async () => {
    const farm_data = {
      name: 'any_name',
      city: 'any_city',
      state: 'any_state',
      crops: [],
      document: '571.678.700-21',
      farm_name: 'any_farm_name',
      total_agricultural_area: 10,
      total_area: 20,
      user_id: 'any_user_id',
      total_vegetation_area: 10,
    };

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
      crops: [],
      farmer_id: farmer.id,
    });

    mockFarmRepository.findCropByName = rightResponse(new SuccessfulResponse(undefined));
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.create = rightResponse(new SuccessfulResponse(farm));
    mockFarmerRepository.create = rightResponse(new SuccessfulResponse(farmer));
    const farmCreated = await createFarmService.execute(farm_data);

    const new_farm = farmCreated.map((farm) => farm);

    console.log(new_farm);

    expect(farmCreated.isRight()).toBeTruthy();
    expect(new_farm.document).toBe(farm_data.document);
    expect(new_farm.farms[0].id).toBeDefined();
    expect(new_farm.farms[0].name).toBe(farm_data.farm_name);
    expect(new_farm.farms[0].city).toBe(farm_data.city);
  });
});
