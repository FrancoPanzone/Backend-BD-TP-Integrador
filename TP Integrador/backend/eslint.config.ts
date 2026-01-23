import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Ignorar dist, node_modules, coverage, etc.
  {
    ignores: ['node_modules', 'dist', 'coverage', 'eslint.config.ts', 'package-lock.json', 'tsconfig.json', "package.json", 'tsconfig.test.json'],
  },

  // Reglas para JS/TS en general
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      js,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },

  // Reglas específicas de TypeScript
  // {
  //   files: ['**/*.ts'],
  //   languageOptions: {
  //     parser: tseslint.parser,
  //     parserOptions: {
  //       project: './tsconfig.json',
  //       sourceType: 'module',
  //     },
  //   },
  //   plugins: {
  //     '@typescript-eslint': tseslint.plugin,
  //     prettier,
  //   },
  //   rules: {
  //     ...tseslint.configs.recommendedTypeChecked[0].rules,
  //     'prettier/prettier': 'error',

  //     // Sobrescribir la regla de ESLint por la de TypeScript
  //     'no-unused-vars': 'off',
  //     '@typescript-eslint/no-unused-vars': ['warn', {
  //       argsIgnorePattern: '^_',
  //       varsIgnorePattern: '^_',
  //       caughtErrorsIgnorePattern: '^_',
  //     }],
  //   },
  // },

  // Código TypeScript normal
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // solo el tsconfig normal
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier,
    },
    rules: {
      ...tseslint.configs.recommendedTypeChecked[0].rules,
      'prettier/prettier': 'error',

      // Sobrescribir la regla de ESLint por la de TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },

  // Tests y setup de Jest
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.test.json',
        sourceType: 'module',
      },
      globals: { ...globals.jest }
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      ...tseslint.configs.recommendedTypeChecked[0].rules,
      'prettier/prettier': 'error',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },

  // {
  //   files: ['tests/**/*.ts', 'jest.setup.ts'],
  //   languageOptions: {
  //     parser: tseslint.parser,
  //     parserOptions: {
  //       project: './tsconfig.test.json', // tsconfig de tests
  //       sourceType: 'module',
  //     },
  //     globals: { ...globals.jest }, // habilitar globals de Jest
  //   },
  //   plugins: {
  //     '@typescript-eslint': tseslint.plugin,
  //     prettier,
  //   },
  //   rules: {
  //     ...tseslint.configs.recommendedTypeChecked[0].rules,
  //     'prettier/prettier': 'error',

  //     'no-unused-vars': 'off',
  //     '@typescript-eslint/no-unused-vars': ['warn', {
  //       argsIgnorePattern: '^_',
  //       varsIgnorePattern: '^_',
  //       caughtErrorsIgnorePattern: '^_',
  //     }],
  //   },
  // },



  // Reglas para JSON
  // {
  //   files: ['**/*.json'],
  //   language: 'json/json',
  //   plugins: {
  //     json,
  //   },
  //   rules: {
  //     ...json.configs.recommended.rules,
  //   },
  // },
  {
    files: ['**/*.json'],
    ...json.configs.recommended,
  },

  // Reglas para archivos test
  {
    files: ['**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.jest, // habilita los globals de Jest
      },
    },
  }
]);


