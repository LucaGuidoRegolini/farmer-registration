import { mockUserRepository } from '@tests/doubles/repositories/in-memory.repository';
import { BadRequestError, InternalServerError } from '@infra/errors/http_errors';
import { CreateUserService } from '@modules/user/services/create_user.service';
import { leftResponse } from '@tests/mocks/responses';
import { AppError } from '@infra/errors';

describe('Create user service', () => {
  let createUserService: CreateUserService;

  beforeEach(() => {
    createUserService = CreateUserService.getInstance(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createUserService).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {
      name: 'any_name',
      password: 'any_password',
    };

    const userCreated = await createUserService.execute(user);

    const new_user = userCreated.map((user) => user);

    expect(userCreated.isRight()).toBeTruthy();
    expect(new_user.user.id).toBeDefined();
    expect(new_user.user.name).toBe(user.name);
  });

  it('should not create a user because a error in DB', async () => {
    const user = {
      name: 'any_name',
      password: 'any_password',
    };

    await createUserService.execute(user);

    mockUserRepository.create = leftResponse(
      new InternalServerError('Error on create user'),
    );

    const userCreated = await createUserService.execute(user);
    const response = userCreated.value;

    expect(userCreated.isLeft()).toBeTruthy();
    expect(response).toBeInstanceOf(AppError);
  });

  it('should not create a existent user', async () => {
    const user = {
      name: 'any_name',
      password: 'any_password',
    };

    mockUserRepository.findOne = jest.fn().mockResolvedValueOnce({
      isLeft: () => false,
      isRight: () => true,
      value: {
        value: {
          id: 'any_id',
          name: 'any_name',
          password: 'any_password',
        },
      },
    });

    const userCreated = await createUserService.execute(user);
    const response = userCreated.value;

    expect(userCreated.isLeft()).toBeTruthy();
    expect(response).toBeInstanceOf(BadRequestError);
  });
});
