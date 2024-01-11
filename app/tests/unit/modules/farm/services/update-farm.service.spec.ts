import {
  mockFarmRepository,
  mockFarmerRepository,
  mockUserRepository,
} from '@tests/doubles/repositories/in-memory.repository';
import { UpdateFarmService } from '@modules/farm/services/update-farm.service';
import { Farmer } from '@modules/farm/domains/farmer.domain';
import { BadRequestError } from '@infra/errors/http_errors';
import { Crop } from '@modules/farm/domains/crop.domain';
import { Farm } from '@modules/farm/domains/farm.domain';
import { User } from '@modules/user/domains/user.domain';
import { Document } from '@shared/valueObjects/document';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

describe('Delete farm service', () => {
  let updateFarmService: UpdateFarmService;

  beforeEach(() => {
    updateFarmService = UpdateFarmService.getInstance(
      mockFarmRepository,
      mockFarmerRepository,
      mockUserRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(updateFarmService).toBeDefined();
  });

  it('should update a farm', async () => {
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
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.findOne = rightResponse(new SuccessfulResponse(farm));
    mockFarmerRepository.findOne = rightResponse(new SuccessfulResponse(farmer));
    mockFarmRepository.update = rightResponse(new SuccessfulResponse(undefined));
    mockFarmerRepository.update = rightResponse(new SuccessfulResponse(undefined));
    const farmCreated = await updateFarmService.execute({
      user_id: user.id,
      farmer_id: farmer.id,
      city: 'new_city',
      crops: ['Café'],
    });

    const resp = farmCreated.map((farm) => farm);

    expect(farmCreated.isRight()).toBeTruthy();
    expect(resp.farms[0].city).toBe('new_city');
  });

  it('should not update a farm because user not exist', async () => {
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
    mockFarmRepository.findOne = rightResponse(new SuccessfulResponse(farm));
    mockFarmerRepository.findOne = rightResponse(new SuccessfulResponse(farmer));
    mockFarmRepository.update = rightResponse(new SuccessfulResponse(undefined));
    mockFarmerRepository.update = rightResponse(new SuccessfulResponse(undefined));
    const farmCreated = await updateFarmService.execute({
      user_id: user.id,
      farmer_id: farmer.id,
      city: 'new_city',
      crops: ['Café'],
    });

    const resp = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(resp.message).toBe('User not found');
  });

  it('should not update a farm because farmer not exist', async () => {
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
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.findOne = rightResponse(new SuccessfulResponse(farm));
    mockFarmerRepository.findOne = rightResponse(new SuccessfulResponse(undefined));
    mockFarmRepository.update = rightResponse(new SuccessfulResponse(undefined));
    mockFarmerRepository.update = rightResponse(new SuccessfulResponse(undefined));
    const farmCreated = await updateFarmService.execute({
      user_id: user.id,
      farmer_id: farmer.id,
      city: 'new_city',
      crops: ['Café'],
    });

    const resp = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(resp.message).toBe('Farmer not found');
  });

  it('should not update a farm because farmer not exist', async () => {
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
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.findOne = rightResponse(new SuccessfulResponse(undefined));
    mockFarmerRepository.findOne = rightResponse(new SuccessfulResponse(farmer));
    mockFarmRepository.update = rightResponse(new SuccessfulResponse(undefined));
    mockFarmerRepository.update = rightResponse(new SuccessfulResponse(undefined));
    const farmCreated = await updateFarmService.execute({
      user_id: user.id,
      farmer_id: farmer.id,
      city: 'new_city',
      crops: ['Café'],
    });

    const resp = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(resp.message).toBe('Farm not found');
  });

  it('should not update a farm because new crop not exist', async () => {
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
    mockFarmRepository.findCropByName = rightResponse(new SuccessfulResponse(undefined));
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.findOne = rightResponse(new SuccessfulResponse(farm));
    mockFarmerRepository.findOne = rightResponse(new SuccessfulResponse(farmer));
    mockFarmRepository.update = rightResponse(new SuccessfulResponse(undefined));
    mockFarmerRepository.update = rightResponse(new SuccessfulResponse(undefined));
    const farmCreated = await updateFarmService.execute({
      user_id: user.id,
      farmer_id: farmer.id,
      city: 'new_city',
      crops: ['Café'],
    });

    const resp = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(resp.message).toBe('Crop not found');
  });

  it('should not update a farm because new area is invalid', async () => {
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
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmRepository.findOne = rightResponse(new SuccessfulResponse(farm));
    mockFarmerRepository.findOne = rightResponse(new SuccessfulResponse(farmer));
    mockFarmRepository.update = rightResponse(new SuccessfulResponse(undefined));
    mockFarmerRepository.update = rightResponse(new SuccessfulResponse(undefined));
    const farmCreated = await updateFarmService.execute({
      user_id: user.id,
      farmer_id: farmer.id,
      total_agricultural_area: 30,
      city: 'new_city',
      crops: ['Café'],
    });

    const resp = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(resp.message).toBe(
      'Total area must be equal to the sum of agricultural area and vegetation area',
    );
  });
});
