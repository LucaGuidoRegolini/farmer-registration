import { compareSync, hashSync } from 'bcryptjs';

export class Bcrypt {
  static hash(password: string, salt?: number): string {
    return salt ? hashSync(password, salt) : hashSync(password, 10);
  }

  static compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
