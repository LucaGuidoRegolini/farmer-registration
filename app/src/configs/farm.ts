export type cropType = 'Soja' | 'Milho' | 'Algodão' | 'Cana de Açucar' | 'Café';

export function isCropType(value: any): value is cropType {
  return ['Soja', 'Milho', 'Algodão', 'Cana de Açucar', 'Café'].includes(value);
}
