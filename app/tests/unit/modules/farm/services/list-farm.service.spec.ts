import {
  mockFarmRepository,
  mockFarmerRepository,
  mockUserRepository,
} from '@tests/doubles/repositories/in-memory.repository';
import { ListFarmersService } from '@modules/farm/services/list-farmers.service';
import { leftResponse, rightResponse } from '@tests/mocks/responses';
import { Farmer } from '@modules/farm/domains/farmer.domain';
import { BadRequestError } from '@infra/errors/http_errors';
import { Crop } from '@modules/farm/domains/crop.domain';
import { Farm } from '@modules/farm/domains/farm.domain';
import { User } from '@modules/user/domains/user.domain';
import { Document } from '@shared/valueObjects/document';
import { SuccessfulResponse } from '@infra/either';

describe('List farm service', () => {
  let listFarmersService: ListFarmersService;

  beforeEach(() => {
    listFarmersService = ListFarmersService.getInstance(
      mockFarmRepository,
      mockFarmerRepository,
      mockUserRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(listFarmersService).toBeDefined();
  });

  it('should list all farmers', async () => {
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
    mockFarmerRepository.list = rightResponse({
      data: [farmer],
      page: 1,
      limit: 10,
      total: 1,
    });
    const farmCreated = await listFarmersService.execute({
      user_id: user.id,
      page: 1,
    });

    const resp = farmCreated.map((farm) => farm);

    expect(farmCreated.isRight()).toBeTruthy();
    expect(resp.farmers[0].id).toBe(farmer.id);
    expect(resp.farmers[0].document).toBe(farmer.document);
    expect(resp.page).toBe(1);
    expect(resp.total).toBe(1);
  });

  it('should not list a farm because user not exist', async () => {
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
    mockFarmerRepository.list = rightResponse({
      data: [farmer],
      page: 1,
      limit: 10,
      total: 1,
    });
    const farmCreated = await listFarmersService.execute({
      user_id: user.id,
      page: 1,
    });

    const resp = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(resp.message).toBe('User not found');
  });

  it('should not list a farm because list farm not worked', async () => {
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

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));
    mockFarmerRepository.list = leftResponse(new BadRequestError('Farm Error'));
    const farmCreated = await listFarmersService.execute({
      user_id: user.id,
      page: 1,
    });

    const resp = farmCreated.value as BadRequestError;

    expect(farmCreated.isLeft()).toBeTruthy();
    expect(resp.message).toBe('Farm Error');
  });
});
