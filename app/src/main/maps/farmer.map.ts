import { FarmerWebDTO, FarmerWithoutFarmsWebDTO } from '@modules/farm/dto/farmer.dto';
import { Farmer } from '@modules/farm/domains/farmer.domain';
import { Farm } from '@modules/farm/domains/farm.domain';
import { Document } from '@shared/valueObjects/document';
import { FarmerModel } from '@prisma/client';
import { FarmMap } from './farm.map';

export class FarmerMap {
  static domainToPrisma(farmer: Farmer): FarmerModel {
    return {
      id: farmer.id,
      name: farmer.name,
      document: farmer.document,
      userId: farmer.user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static partialDomainToPrisma(farmer: Partial<Farmer>): Partial<FarmerModel> {
    return {
      id: farmer.id,
      name: farmer.name,
      document: farmer.document,
      userId: farmer.user_id,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  static prismaToDomain(farmer: FarmerModel): Farmer {
    const document = Document.create(farmer.document).map((d) => d);

    return new Farmer({
      id: farmer.id,
      name: farmer.name,
      document: document,
      user_id: farmer.userId,
    });
  }

  static domainToWeb(farmer: Farmer, farms: Farm[]): FarmerWebDTO {
    const farm_web = farms.map((farm) => FarmMap.domainToWeb(farm));

    return {
      id: farmer.id,
      name: farmer.name,
      document: farmer.document,
      farms: farm_web,
    };
  }

  static domainToWebWithoutFarms(farmer: Farmer): FarmerWithoutFarmsWebDTO {
    return {
      id: farmer.id,
      name: farmer.name,
      document: farmer.document,
    };
  }
}
