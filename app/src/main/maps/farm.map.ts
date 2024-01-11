import { Crop } from '@modules/farm/domains/crop.domain';
import { Farm } from '@modules/farm/domains/farm.domain';
import { FarmWebDTO } from '@modules/farm/dto/farm.dto';
import { CropModel, FarmModel } from '@prisma/client';
import { cropType } from '@configs/farm';

export class FarmMap {
  static domainToPrisma(farm: Farm): FarmModel {
    return {
      id: farm.id,
      name: farm.name,
      city: farm.city,
      farmenId: farm.farmer_id,
      userId: farm.user_id,
      state: farm.state,
      total_agricultural_area: farm.total_agricultural_area,
      total_area: farm.total_area,
      total_vegetation_area: farm.total_vegetation_area,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static partialDomainToPrisma(farm: Partial<Farm>): Partial<FarmModel> {
    return {
      id: farm.id,
      name: farm.name,
      city: farm.city,
      farmenId: farm.farmer_id,
      userId: farm.user_id,
      state: farm.state,
      total_agricultural_area: farm.total_agricultural_area,
      total_area: farm.total_area,
      total_vegetation_area: farm.total_vegetation_area,

      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  static prismaToDomain(farm: FarmModel, crop: CropModel[]): Farm {
    const crops = crop.map(
      (c) =>
        new Crop({
          id: c.id,
          name: c.name as cropType,
        }),
    );

    return new Farm({
      id: farm.id,
      name: farm.name,
      city: farm.city,
      farmer_id: farm.farmenId,
      user_id: farm.userId,
      state: farm.state,
      total_agricultural_area: farm.total_agricultural_area,
      total_area: farm.total_area,
      total_vegetation_area: farm.total_vegetation_area,
      crops,
    });
  }

  static domainToWeb(farm: Farm): FarmWebDTO {
    return {
      id: farm.id,
      name: farm.name,
      city: farm.city,
      state: farm.state,
      total_area: farm.total_area,
      total_agricultural_area: farm.total_agricultural_area,
      total_vegetation_area: farm.total_vegetation_area,
      crops: farm.crops,
    };
  }
}

export class CropMap {
  static domainToPrisma(crop: Crop): CropModel {
    return {
      id: crop.id,
      name: crop.name,
    };
  }

  static prismaToDomain(crop: CropModel): Crop {
    return new Crop({
      id: crop.id,
      name: crop.name as cropType,
    });
  }
}
