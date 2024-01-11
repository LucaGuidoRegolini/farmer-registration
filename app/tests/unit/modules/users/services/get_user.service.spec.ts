import { mockUserRepository } from '@tests/doubles/repositories/in-memory.repository';
import { GetUserService } from '@modules/user/services/get_user.service';
import { BadRequestError } from '@infra/errors/http_errors';
import { User } from '@modules/user/domains/user.domain';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';

describe('Get user service', () => {
  let getUserService: GetUserService;

  beforeEach(() => {
    getUserService = GetUserService.getInstance(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(getUserService).toBeDefined();
  });

  it('should get user', async () => {
    const user = User.create({
      name: 'any_name',
      password: 'any_password',
    });

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const userCreated = await getUserService.execute({ id: user.id });

    const new_user = userCreated.map((user) => user);

    expect(userCreated.isRight()).toBeTruthy();
    expect(new_user.id).toBeDefined();
    expect(new_user.name).toBe(user.name);
  });

  it('should not get user because user not exist', async () => {
    const user = User.create({
      name: 'any_name',
      password: 'any_password',
    });

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(undefined));

    const userCreated = await getUserService.execute({ id: user.id });

    const new_user = userCreated.value;

    expect(userCreated.isLeft()).toBeTruthy();
    expect(new_user).toBeInstanceOf(BadRequestError);
  });
});
