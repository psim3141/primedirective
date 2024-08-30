// eslint.config.mjs

import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: eslintPluginReact,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // ESLint base rules
      'no-unused-vars': 'warn',
      'no-console': 'off',

      // Indentation rule
      'indent': ['error', 4], // 4 spaces for indentation

      // React specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off',

      // Prettier
      'prettier/prettier': ['error', { tabWidth: 4 }], // Ensure Prettier also uses 4 spaces
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  eslintConfigPrettier, // This disables ESLint rules that conflict with Prettier
];
