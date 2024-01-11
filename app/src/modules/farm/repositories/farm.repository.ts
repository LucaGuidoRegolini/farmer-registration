import {
  IndexRequestInterface,
  IndexResponseInterface,
  ListRequestInterface,
  ListResponseInterface,
} from '@shared/repository/repository.interface';
import { BadRequestError, InternalServerError } from '@infra/errors/http_errors';
import { PrismaOptionsInterface } from '@main/interfaces/prisma.interface';
import { Either, SuccessfulResponse, left, right } from '@infra/either';
import { FarmerModel, PrismaClient } from '@prisma/client';

import { FarmRepositoryInterface } from './farm.repository.interface';
import { CropMap, FarmMap } from '@main/maps/farm.map';
import { Crop } from '../domains/crop.domain';
import { Farm } from '../domains/farm.domain';
import { AppError } from '@infra/errors';

export class FarmRepository implements FarmRepositoryInterface {
  static instance: FarmRepository;
  private _prisma: PrismaClient;

  private constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  public static getInstance(prisma: PrismaClient): FarmRepository {
    if (!this.instance) {
      this.instance = new FarmRepository(prisma);
    }
    return this.instance;
  }

  async delete(id: string): Promise<Either<AppError, SuccessfulResponse<string>>> {
    try {
      const resp = await this._prisma.farmModel.delete({ where: { id } });
      return right(SuccessfulResponse.success(resp.id));
    } catch (error) {
      return left(new InternalServerError('Error on delete farm'));
    }
  }
  async findOne(
    filter: Partial<Farm>,
  ): Promise<Either<AppError, SuccessfulResponse<Farm | undefined>>> {
    try {
      const farm = FarmMap.partialDomainToPrisma(filter);
      const resp = await this._prisma.farmModel.findFirst({
        where: farm,
        include: { planted_crop: true },
      });

      if (!resp) {
        return right(SuccessfulResponse.success(undefined));
      }

      const { planted_crop, ...value } = resp;
      const output = resp ? FarmMap.prismaToDomain(value, planted_crop) : undefined;
      return right(SuccessfulResponse.success(output));
    } catch (error) {
      return left(new InternalServerError('Error on find farm'));
    }
  }
  async index(
    data: IndexRequestInterface<Farm>,
  ): Promise<Either<AppError, IndexResponseInterface<Farm>>> {
    try {
      const { filter, order, orderBy } = data;

      const db_order = order === 'descending' ? 'desc' : 'asc';

      const farm = FarmMap.partialDomainToPrisma(filter || {});

      const options: PrismaOptionsInterface<FarmerModel> = {
        where: farm,
      };

      if (orderBy) {
        options.orderBy = {
          [String(data.orderBy)]: db_order,
        };
      }

      const resp = await this._prisma.farmModel.findMany({
        include: { planted_crop: true },
        ...options,
      });

      const output = resp.map(({ planted_crop, ...item }) =>
        FarmMap.prismaToDomain(item, planted_crop),
      );

      return right({
        data: output,
        filter,
        order,
        orderBy,
      });
    } catch (error) {
      return left(new InternalServerError('Error on index farm'));
    }
  }
  async list({
    page = 1,
    limit = 10,
    ...data
  }: ListRequestInterface<Farm>): Promise<Either<AppError, ListResponseInterface<Farm>>> {
    try {
      const { filter, order, orderBy } = data;

      const db_order = order === 'descending' ? 'desc' : 'asc';

      const farm = FarmMap.partialDomainToPrisma(filter || {});

      const options: PrismaOptionsInterface<FarmerModel> = {
        where: farm,
        skip: (page - 1) * limit,
        take: limit,
      };

      if (orderBy) {
        options.orderBy = {
          [String(data.orderBy)]: db_order,
        };
      }

      const options_count: PrismaOptionsInterface<FarmerModel> = {
        where: farm,
      };

      const [resp, count] = await this._prisma.$transaction([
        this._prisma.farmModel.findMany({
          ...options,
          include: { planted_crop: true },
        }),
        this._prisma.farmModel.count(options_count),
      ]);

      const output = resp.map(({ planted_crop, ...item }) =>
        FarmMap.prismaToDomain(item, planted_crop),
      );

      return right({
        data: output,
        page,
        limit,
        total: count,
      });
    } catch (error) {
      return left(new InternalServerError('Error on index farm'));
    }
  }

  async findCropByName(
    name: string | string[],
  ): Promise<Either<AppError, SuccessfulResponse<Crop[] | undefined>>> {
    try {
      const names = Array.isArray(name) ? name : [name];

      const resp = await this._prisma.cropModel.findMany({
        where: {
          name: {
            in: names,
          },
        },
      });

      if (resp.length !== names.length) {
        return right(SuccessfulResponse.success(undefined));
      }

      const output = resp.map((item) => CropMap.prismaToDomain(item));

      return right(SuccessfulResponse.success(output));
    } catch (error) {
      return left(new InternalServerError('Error on find farm'));
    }
  }

  async create(item: Farm): Promise<Either<AppError, SuccessfulResponse<Farm>>> {
    try {
      const planted_crops = item.crops.map((crop) => CropMap.domainToPrisma(crop));

      const farm = FarmMap.domainToPrisma(item);
      await this._prisma.farmModel.create({
        data: {
          ...farm,
          planted_crop: {
            connect: planted_crops,
          },
        },
      });
      return right(SuccessfulResponse.success(item));
    } catch (error) {
      return left(new InternalServerError('Error on create farm'));
    }
  }

  async update(
    id: string,
    item: Partial<Farm>,
  ): Promise<Either<AppError, SuccessfulResponse<Partial<Farm>>>> {
    try {
      const resp = await this._prisma.farmModel.findFirst({
        where: {
          id,
        },
        include: { planted_crop: true },
      });

      if (!resp) {
        return left(new BadRequestError('farm not found'));
      }

      const prisma_obj = FarmMap.partialDomainToPrisma(item);

      const planted_crops =
        item.crops?.map((crop) => CropMap.domainToPrisma(crop)) || resp.planted_crop;

      const connect_crops_id = planted_crops.map((crop) => ({ id: crop.id }));
      let disconnect_crops_id = resp.planted_crop.map((crop) => ({ id: crop.id }));

      disconnect_crops_id = disconnect_crops_id.filter(
        (crop) => !connect_crops_id.find((crop_id) => crop_id.id === crop.id),
      );

      await this._prisma.farmModel.update({
        data: {
          ...prisma_obj,
          planted_crop: {
            connect: connect_crops_id,
            disconnect: disconnect_crops_id,
          },
        },
        where: {
          id,
        },
      });

      return right(new SuccessfulResponse(item));
    } catch (error) {
      console.log(error);
      return left(new InternalServerError('Error on update farm'));
    }
  }
}
