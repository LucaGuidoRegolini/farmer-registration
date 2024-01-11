import { Crop } from '@modules/farm/domains/crop.domain';
import { Farm } from '@modules/farm/domains/farm.domain';

describe('farm domain and crop domain', () => {
  it('should be create a farm and crop', () => {
    const crop = Crop.create({
      name: 'Algodão',
    });

    const farm = Farm.create({
      name: 'any_name',
      city: 'any_city',
      state: 'any_state',
      crops: [crop],
      total_area: 10,
      total_agricultural_area: 5,
      total_vegetation_area: 5,
      farmer_id: 'any_farmer_id',
      user_id: 'any_user_id',
    });

    expect(farm.name).toBe('any_name');
    expect(farm.id).toBeDefined();
    expect(farm.city).toBe('any_city');
    expect(farm.state).toBe('any_state');
    expect(farm.crops).toEqual([crop]);
    expect(farm.crops[0].name).toBe('Algodão');
    expect(farm.total_area).toBe(10);
    expect(farm.isAreValid()).toBe(true);
  });

  it('should be create a farm and crop with id', () => {
    const crop = new Crop({
      id: 'any_id',
      name: 'Algodão',
    });

    const farm = new Farm({
      id: 'any_id',
      name: 'any_name',
      city: 'any_city',
      state: 'any_state',
      crops: [crop],
      total_area: 10,
      total_agricultural_area: 5,
      total_vegetation_area: 5,
      farmer_id: 'any_farmer_id',
      user_id: 'any_user_id',
    });

    expect(farm.name).toBe('any_name');
    expect(farm.id).toBe('any_id');
    expect(farm.city).toBe('any_city');
    expect(farm.state).toBe('any_state');
    expect(farm.crops).toEqual([crop]);
    expect(farm.crops[0].name).toBe('Algodão');
    expect(farm.total_area).toBe(10);
    expect(farm.isAreValid()).toBe(true);
  });

  it('should be change the farm data', () => {
    const crop = new Crop({
      id: 'any_id',
      name: 'Algodão',
    });

    const farm = new Farm({
      id: 'any_id',
      name: 'any_name',
      city: 'any_city',
      state: 'any_state',
      crops: [],
      total_area: 10,
      total_agricultural_area: 5,
      total_vegetation_area: 5,
      farmer_id: 'any_farmer_id',
      user_id: 'any_user_id',
    });

    farm.setName('new_name');

    farm.setCity('new_city');

    farm.setState('new_state');

    farm.setFarmerId('new_farmer_id');

    farm.setUser('new_user_id');

    crop.setName('Café');

    farm.addCrop(crop);

    farm.setTotalArea(20);

    farm.setTotalAgriculturalArea(10);

    farm.setTotalVegetationArea(10);

    expect(farm.name).toBe('new_name');
    expect(farm.id).toBe('any_id');
    expect(farm.city).toBe('new_city');
    expect(farm.state).toBe('new_state');
    expect(farm.user_id).toEqual('new_user_id');
    expect(farm.crops).toEqual([crop]);
    expect(farm.crops[0].name).toBe('Café');
    expect(farm.total_area).toBe(20);
    expect(farm.total_agricultural_area).toBe(10);
    expect(farm.total_vegetation_area).toBe(10);
    expect(farm.farmer_id).toBe('new_farmer_id');
    expect(farm.isAreValid()).toBe(true);

    farm.removeCrop(crop);

    expect(farm.crops).toEqual([]);
  });

  it('should be create a farm with a invalid area', () => {
    const crop = new Crop({
      id: 'any_id',
      name: 'Algodão',
    });

    const farm = new Farm({
      id: 'any_id',
      name: 'any_name',
      city: 'any_city',
      state: 'any_state',
      crops: [crop],
      total_area: 10,
      total_agricultural_area: 8,
      total_vegetation_area: 5,
      farmer_id: 'any_farmer_id',
      user_id: 'any_user_id',
    });

    expect(farm.name).toBe('any_name');
    expect(farm.id).toBe('any_id');
    expect(farm.isAreValid()).toBe(false);
  });
});
