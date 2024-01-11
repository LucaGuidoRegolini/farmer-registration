import { Bcrypt } from '@shared/utils/bCrypt';

describe('Bcrypt helper class', () => {
  it('should be create a hash valid', () => {
    const first_hash = Bcrypt.hash('any_password');
    const second_hash = Bcrypt.hash('any_password');

    const valid_first_hash = Bcrypt.compare('any_password', first_hash);

    expect(first_hash).not.toEqual(second_hash);
    expect(valid_first_hash).toBeTruthy();
  });

  it('should be create a hash valid with salt', () => {
    const hash = Bcrypt.hash('any_password', 8);

    const valid_hash = Bcrypt.compare('any_password', hash);

    expect(valid_hash).toBeTruthy();
  });
});
