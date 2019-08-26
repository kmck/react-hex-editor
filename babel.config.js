module.exports = {
  presets: [
    ['@babel/env', { targets: { node: 'current' } }],
    '@babel/typescript',
    '@babel/react',
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    [
      '@babel/plugin-proposal-class-properties',
      { loose: true },
    ],
  ],
};
