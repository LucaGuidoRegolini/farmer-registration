import { User } from '@modules/user/domains/user.domain';

describe('user domain', () => {
  it('should be create a user', () => {
    const user = User.create({
      name: 'any_name',
      password: 'any_password',
    });

    const password = User.hashPassword('any_password');

    expect(user.name).toBe('any_name');
    expect(user.id).toBeDefined();
  });

  it('should be create a user with id', () => {
    const user = new User({
      name: 'any_name',
      password: 'any_password',
      id: 'any_id',
    });

    expect(user.name).toBe('any_name');
    expect(user.password).toBe('any_password');
    expect(user.id).toBe('any_id');
  });

  it('should be change password and name', () => {
    const user = User.create({
      name: 'any_name',
      password: 'any_password',
    });

    const newPassword = 'new_password';

    const oldPassword = user.password;

    user.setPassword(newPassword);

    user.setName('new_name');

    expect(user.name).toBe('new_name');
    expect(user.password).not.toBe(oldPassword);
  });
});
