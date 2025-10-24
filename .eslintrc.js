module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // Phaser specific rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    
    // Game development often needs these
    'no-case-declarations': 'off',
    'prefer-const': 'warn',
    
    // Formatting
    'semi': ['error', 'always'],
    'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }]
  },
  env: {
    browser: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  ignorePatterns: ['dist/**/*', 'node_modules/**/*']
};
