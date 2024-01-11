import { Document } from '@shared/valueObjects/document';
import { FarmWebDTO } from './farm.dto';

export interface CreateFarmerDTO {
  id?: string;
  name: string;
  document: Document;
  user_id: string;
}

export interface FarmerWebDTO {
  id: string;
  name: string;
  document: string;
  farms: FarmWebDTO[];
}

export interface FarmerWithoutFarmsWebDTO {
  id: string;
  name: string;
  document: string;
}
