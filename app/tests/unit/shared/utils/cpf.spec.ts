import { cpf as cpfModule } from '@shared/utils/cpf';

describe('cpf helper function', () => {
  it('should be return true if cpf is valid', () => {
    const cpf = '865.580.820-20';

    const isValid = cpfModule.isValid(cpf);

    expect(isValid).toBeTruthy();
  });

  it('should be strip the cpf mask', () => {
    const cpf = '?865.580.820-20';

    const strip_cpf = cpfModule.strip(cpf);
    const strict_strip_cpf = cpfModule.strip(cpf, true);

    expect(strip_cpf).toBe('86558082020');
    expect(strict_strip_cpf).toBe('?86558082020');
  });

  it('should be return false if cpf is invalid', () => {
    const cpf = '865.580.820-23';

    const isValid = cpfModule.isValid(cpf);

    expect(isValid).toBeFalsy();
  });

  it('should be return false if cpf is invalid and in BLACKLIST', () => {
    const cpf = '11111111111';

    const isValid = cpfModule.isValid(cpf);

    expect(isValid).toBeFalsy();
  });

  it('should be generate a valid cpf', () => {
    const cpf = cpfModule.generate();

    const isValid = cpfModule.isValid(cpf);

    expect(isValid).toBeTruthy();
  });

  it('should be generate a valid cpf with mask', () => {
    const cpf = cpfModule.generate(true);

    const isValid = cpfModule.isValid(cpf);

    expect(isValid).toBeTruthy();
  });
});
