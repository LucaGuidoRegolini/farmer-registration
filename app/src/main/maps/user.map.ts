import { User } from '@modules/user/domains/user.domain';
import { UserWebDTO } from '@modules/user/dto/user.dto';
import { UserModel } from '@prisma/client';

export class UserMap {
  static domainToPrisma(user: User): UserModel {
    return {
      id: user.id,
      name: user.name,
      password: user.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static partialDomainToPrisma(user: Partial<User>): Partial<UserModel> {
    return {
      id: user.id,
      name: user.name,
      password: user.password || undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  static prismaToDomain(user: UserModel): User {
    return new User({
      id: user.id,
      name: user.name,
      password: user.password,
    });
  }

  static domainToWeb(user: User): UserWebDTO {
    return {
      id: user.id,
      name: user.name,
    };
  }
}
