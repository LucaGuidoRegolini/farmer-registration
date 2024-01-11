// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: 'yarn',
  reporters: ['clear-text', 'progress', 'dots', 'dashboard', 'html', 'json'],
  testRunner: 'jest',
  jest: {
    configFile: 'jest.config.js',
  },
  coverageAnalysis: 'perTest',

  tsconfigFile: 'tsconfig.json',
  disableTypeChecks: true,
  mutator: {
    plugins: [],
  },
  timeoutMS: 30000,
  timeoutFactor: 4,
  concurrency: 5,
};
export default config;
