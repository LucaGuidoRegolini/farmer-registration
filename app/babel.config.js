module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@infra': './src/infra',
          '@shared': './src/shared',
          '@modules': './src/modules',
          '@configs': './src/configs',
          '@main': './src/main',
          '@factories': './src/main/factories',
          '@maps': './src/main/maps',
          '@adapters': './src/main/adapters',
          '@interfaces': './src/shared/interfaces',
          '@utils': './src/shared/utils',
          '@tests': './tests',
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ],
};
