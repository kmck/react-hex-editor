module.exports = {
  extends: 'react-app',
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    // Rule defined in react-app but no longer valid
    '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
  },
};
