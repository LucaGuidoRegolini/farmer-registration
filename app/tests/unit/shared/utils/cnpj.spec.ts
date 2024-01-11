import { cnpj as cnpjModule } from '@shared/utils/cnpj';

describe('cnpj helper function', () => {
  it('should be return true if cnpj is valid', () => {
    const cnpj = '11.222.333/0001-81';

    const isValid = cnpjModule.isValid(cnpj);

    expect(isValid).toBeTruthy();
  });

  it('should be strip the cnpj mask', () => {
    const cnpj = '?11.222.333/0001-81';

    const strip_cnpj = cnpjModule.strip(cnpj);
    const strict_strip_cnpj = cnpjModule.strip(cnpj, true);

    expect(strip_cnpj).toBe('11222333000181');
    expect(strict_strip_cnpj).toBe('?11222333000181');
  });

  it('should be return false if cnpj is invalid', () => {
    const cnpj = '11.222.333/0001-82';

    const isValid = cnpjModule.isValid(cnpj);

    expect(isValid).toBeFalsy();
  });

  it('should be return false if cnpj is invalid and in BLACKLIST', () => {
    const cnpj = '00000000000000';

    const isValid = cnpjModule.isValid(cnpj);

    expect(isValid).toBeFalsy();
  });

  it('should be generate a valid cnpj', () => {
    const cnpj = cnpjModule.generate();

    const isValid = cnpjModule.isValid(cnpj);

    expect(isValid).toBeTruthy();
  });

  it('should be generate a valid cnpj with mask', () => {
    const cnpj = cnpjModule.generate(true);

    const isValid = cnpjModule.isValid(cnpj);

    expect(isValid).toBeTruthy();
  });
});
