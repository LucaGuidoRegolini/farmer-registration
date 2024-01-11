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
import { FarmerModel, PrismaClient } from '@prisma/client';

import { FarmerRepositoryInterface } from './farmer.repository.interface';
import { Farmer } from '../domains/farmer.domain';
import { FarmerMap } from '@main/maps/farmer.map';
import { AppError } from '@infra/errors';

export class FarmerRepository implements FarmerRepositoryInterface {
  static instance: FarmerRepository;
  private _prisma: PrismaClient;

  private constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  public static getInstance(prisma: PrismaClient): FarmerRepository {
    if (!this.instance) {
      this.instance = new FarmerRepository(prisma);
    }
    return this.instance;
  }

  async delete(id: string): Promise<Either<AppError, SuccessfulResponse<string>>> {
    try {
      const resp = await this._prisma.farmerModel.delete({ where: { id } });
      return right(SuccessfulResponse.success(resp.id));
    } catch (error) {
      return left(new InternalServerError('Error on delete user'));
    }
  }
  async findOne(
    filter: Partial<Farmer>,
  ): Promise<Either<AppError, SuccessfulResponse<Farmer | undefined>>> {
    try {
      const user = FarmerMap.partialDomainToPrisma(filter);
      const resp = await this._prisma.farmerModel.findFirst({ where: user });
      const output = resp ? FarmerMap.prismaToDomain(resp) : undefined;
      return right(SuccessfulResponse.success(output));
    } catch (error) {
      return left(new InternalServerError('Error on find user'));
    }
  }
  async index(
    data: IndexRequestInterface<Farmer>,
  ): Promise<Either<AppError, IndexResponseInterface<Farmer>>> {
    try {
      const { filter, order, orderBy } = data;

      const db_order = order === 'descending' ? 'desc' : 'asc';

      const user = FarmerMap.partialDomainToPrisma(filter || {});

      const options: PrismaOptionsInterface<FarmerModel> = {
        where: user,
      };

      if (orderBy) {
        options.orderBy = {
          [String(data.orderBy)]: db_order,
        };
      }

      const resp = await this._prisma.farmerModel.findMany(options);

      const output = resp.map((item) => FarmerMap.prismaToDomain(item));

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
  }: ListRequestInterface<Farmer>): Promise<
    Either<AppError, ListResponseInterface<Farmer>>
  > {
    try {
      const { filter, order, orderBy } = data;

      const db_order = order === 'descending' ? 'desc' : 'asc';

      const user = FarmerMap.partialDomainToPrisma(filter || {});

      const options: PrismaOptionsInterface<FarmerModel> = {
        where: user,
        skip: (page - 1) * limit,
        take: limit,
      };

      if (orderBy) {
        options.orderBy = {
          [String(data.orderBy)]: db_order,
        };
      }

      const options_count: PrismaOptionsInterface<FarmerModel> = {
        where: user,
      };

      const [resp, count] = await this._prisma.$transaction([
        this._prisma.farmerModel.findMany({
          ...options,
        }),
        this._prisma.farmerModel.count(options_count),
      ]);

      const output = resp.map((item) => FarmerMap.prismaToDomain(item));

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

  async create(item: Farmer): Promise<Either<AppError, SuccessfulResponse<Farmer>>> {
    try {
      const user = FarmerMap.domainToPrisma(item);
      await this._prisma.farmerModel.create({ data: user });
      return right(SuccessfulResponse.success(item));
    } catch (error) {
      return left(new InternalServerError('Error on create user'));
    }
  }

  async update(
    id: string,
    item: Partial<Farmer>,
    retry = 0,
  ): Promise<Either<AppError, SuccessfulResponse<Partial<Farmer>>>> {
    try {
      const resp = await this._prisma.farmerModel.findFirst({
        where: {
          id,
        },
      });

      if (!resp) {
        return left(new BadRequestError('user not found'));
      }

      const prisma_obj = FarmerMap.partialDomainToPrisma(item);

      const response = await this._prisma.farmerModel.updateMany({
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
