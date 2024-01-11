import { CreateUserDTO } from '../dto/user.dto';
import { Bcrypt } from '@shared/utils/bCrypt';
import { password_salt } from '@configs/auth';
import { Domain } from '@shared/domain';

export class User extends Domain {
  private _name: string;
  private _password: string;

  constructor(data: CreateUserDTO) {
    super(data.id);
    this._name = data.name;
    this._password = data.password;
  }

  static create(data: CreateUserDTO): User {
    const user_id = User.createUniqueId();
    const password = User.hashPassword(data.password);
    return new User({
      id: user_id,
      name: data.name,
      password: password,
    });
  }

  static hashPassword(password: string): string {
    return Bcrypt.hash(password, password_salt);
  }

  public setPassword(password: string): User {
    this._password = User.hashPassword(password);
    return this;
  }

  public comparePassword(password: string): boolean {
    return Bcrypt.compare(password, this._password);
  }

  public setName(name: string): User {
    this._name = name;
    return this;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }
}
