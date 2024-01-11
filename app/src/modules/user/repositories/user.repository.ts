import {
  IndexRequestInterface,
  IndexResponseInterface,
  ListRequestInterface,
  ListResponseInterface,
} from '@shared/repository/repository.interface';
import {
  BadRequestError,
  ConcurrencyError,
  InternalServerError,
} from '@infra/errors/http_errors';
import { PrismaOptionsInterface } from '@main/interfaces/prisma.interface';
import { Either, SuccessfulResponse, left, right } from '@infra/either';
import { UserRepositoryInterface } from './user.repository.interface';
import { PrismaClient, UserModel } from '@prisma/client';
import { User } from '../domains/user.domain';
import { UserMap } from '@main/maps/user.map';
import { AppError } from '@infra/errors';

export class UserRepository implements UserRepositoryInterface {
  static instance: UserRepository;
  private _prisma: PrismaClient;

  private constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  public static getInstance(prisma: PrismaClient): UserRepository {
    if (!this.instance) {
      this.instance = new UserRepository(prisma);
    }
    return this.instance;
  }

  async delete(id: string): Promise<Either<AppError, SuccessfulResponse<string>>> {
    try {
      const resp = await this._prisma.userModel.delete({ where: { id } });
      return right(SuccessfulResponse.success(resp.id));
    } catch (error) {
      return left(new InternalServerError('Error on delete user'));
    }
  }
  async findOne(
    filter: Partial<User>,
  ): Promise<Either<AppError, SuccessfulResponse<User | undefined>>> {
    try {
      const user = UserMap.partialDomainToPrisma(filter);
      const resp = await this._prisma.userModel.findFirst({ where: user });
      const output = resp ? UserMap.prismaToDomain(resp) : undefined;
      return right(SuccessfulResponse.success(output));
    } catch (error) {
      return left(new InternalServerError('Error on find user'));
    }
  }
  async index(
    data: IndexRequestInterface<User>,
  ): Promise<Either<AppError, IndexResponseInterface<User>>> {
    try {
      const { filter, order, orderBy } = data;

      const db_order = order === 'descending' ? 'desc' : 'asc';

      const user = UserMap.partialDomainToPrisma(filter || {});

      const options: PrismaOptionsInterface<UserModel> = {
        where: user,
      };

      if (orderBy) {
        options.orderBy = {
          [String(data.orderBy)]: db_order,
        };
      }

      const resp = await this._prisma.userModel.findMany(options);

      const output = resp.map((item) => UserMap.prismaToDomain(item));

      return right({
        data: output,
        filter,
        order,
        orderBy,
      });
    } catch (error) {
      return left(new InternalServerError('Error on index user'));
    }
  }
  async list({
    page = 1,
    limit = 10,
    ...data
  }: ListRequestInterface<User>): Promise<Either<AppError, ListResponseInterface<User>>> {
    try {
      const { filter, order, orderBy } = data;

      const db_order = order === 'descending' ? 'desc' : 'asc';

      const user = UserMap.partialDomainToPrisma(filter || {});

      const options: PrismaOptionsInterface<UserModel> = {
        where: user,
        skip: (page - 1) * limit,
        take: limit,
      };

      if (orderBy) {
        options.orderBy = {
          [String(data.orderBy)]: db_order,
        };
      }

      const options_count: PrismaOptionsInterface<UserModel> = {
        where: user,
      };

      const [resp, count] = await this._prisma.$transaction([
        this._prisma.userModel.findMany({
          ...options,
        }),
        this._prisma.userModel.count(options_count),
      ]);

      const output = resp.map((item) => UserMap.prismaToDomain(item));

      return right({
        data: output,
        page,
        limit,
        total: count,
      });
    } catch (error) {
      return left(new InternalServerError('Error on index user'));
    }
  }

  async create(item: User): Promise<Either<AppError, SuccessfulResponse<User>>> {
    try {
      const user = UserMap.domainToPrisma(item);
      await this._prisma.userModel.create({ data: user });
      return right(SuccessfulResponse.success(item));
    } catch (error) {
      return left(new InternalServerError('Error on create user'));
    }
  }

  async update(
    id: string,
    item: Partial<User>,
    retry = 0,
  ): Promise<Either<AppError, SuccessfulResponse<Partial<User>>>> {
    try {
      const resp = await this._prisma.userModel.findFirst({
        where: {
          id,
        },
      });

      if (!resp) {
        return left(new BadRequestError('user not found'));
      }

      const prisma_obj = UserMap.partialDomainToPrisma(item);

      const response = await this._prisma.userModel.updateMany({
        data: {
          ...prisma_obj,
        },
        where: {
          id,
          updatedAt: resp.updatedAt,
        },
      });

      if (response.count <= 0) {
        if (retry >= 1) {
          return this.update(id, item, retry - 1);
        }

        return left(new ConcurrencyError('Concurrency Error'));
      }

      return right(new SuccessfulResponse(item));
    } catch (error) {
      return left(new InternalServerError('Error on update user'));
    }
  }
}
