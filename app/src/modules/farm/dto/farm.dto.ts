import { Crop } from '../domains/crop.domain';

export interface CreateFarmDTO {
  id?: string;
  name: string;
  city: string;
  state: string;
  total_area: number;
  total_agricultural_area: number;
  total_vegetation_area: number;
  farmer_id: string;
  user_id: string;
  crops: Crop[];
}

export interface FarmWebDTO {
  id: string;
  name: string;
  city: string;
  state: string;
  total_area: number;
  total_agricultural_area: number;
  total_vegetation_area: number;
  crops: Crop[];
}
