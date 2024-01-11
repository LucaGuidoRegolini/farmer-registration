import { AuthenticateUserService } from '@modules/user/services/authentication.service';
import { mockUserRepository } from '@tests/doubles/repositories/in-memory.repository';
import { User } from '@modules/user/domains/user.domain';
import { rightResponse } from '@tests/mocks/responses';
import { SuccessfulResponse } from '@infra/either';
import { JSONWebToken } from '@shared/utils/jwt';
import { auth_config } from '@configs/auth';

describe('Authentication user service', () => {
  let authenticateUserService: AuthenticateUserService;

  beforeEach(() => {
    authenticateUserService = AuthenticateUserService.getInstance(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authenticateUserService).toBeDefined();
  });

  it('should authenticate a user', async () => {
    const user = User.create({
      name: 'any_name',
      password: 'any_password',
    });

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const userCreated = await authenticateUserService.execute({
      name: user.name,
      password: 'any_password',
    });

    const new_user = userCreated.map((user) => user);

    const payload = JSONWebToken.verify(new_user.token, auth_config.secreteKey) as any;

    expect(userCreated.isRight()).toBeTruthy();
    expect(new_user.user.id).toBeDefined();
    expect(new_user.user.name).toBe(user.name);
    expect(payload.user_id).toBe(new_user.user.id);
  });

  it('should not authenticate user because user not exist', async () => {
    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(undefined));

    const userCreated = await authenticateUserService.execute({
      name: 'any_name',
      password: 'any_password',
    });

    expect(userCreated.isLeft()).toBeTruthy();
  });

  it('should not authenticate user because user password is wrong', async () => {
    const user = User.create({
      name: 'any_name',
      password: 'any_password',
    });

    mockUserRepository.findOne = rightResponse(new SuccessfulResponse(user));

    const userCreated = await authenticateUserService.execute({
      name: user.name,
      password: 'wrong_password',
    });

    const new_user = userCreated.map((user) => user);

    expect(userCreated.isLeft()).toBeTruthy();
  });
});
