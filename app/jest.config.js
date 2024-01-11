const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testTimeout: 10000,
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@infra/*': ['/src/infra/*'],
      '@shared/*': ['/src/shared/*'],
      '@modules/*': ['/src/modules/*'],
      '@configs/*': ['/src/configs/*'],
      '@main/*': ['/src/main/*'],
      '@factories/*': ['/src/main/factories/*'],
      '@maps/*': ['/src/main/maps/*'],
      '@adapters/*': ['/src/main/adapter/*'],
      '@interfaces/*': ['/src/shared/interfaces/*'],
      '@utils/*': ['/src/shared/utils/*'],
      '@tests/*': ['/tests/*'],
    },
    { prefix: '<rootDir>/' },
  ),
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 90,
      statements: 85,
    },
  },
  bail: false,
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/modules/**/services/*.ts',
    '<rootDir>/src/modules/**/domains/*.ts',
    '<rootDir>/src/shared/utils/*.ts',
    '<rootDir>/src/shared/valueObjects/*.ts',
  ],
  coverageDirectory: 'reports/coverage',
  coverageProvider: 'babel',
  coverageReporters: ['text', 'lcov'],
  setupFiles: ['./jest-setup-file.ts'],
  testMatch: ['**/*.spec.ts'],
  testPathIgnorePatterns: ['<rootDir>/.stryker-tmp/'],
  modulePathIgnorePatterns: ['<rootDir>/.stryker-tmp'],
};
