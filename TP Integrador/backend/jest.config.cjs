// jest.config.cjs
// /** @type {import('jest').Config} */
// module.exports = {
//   preset: 'ts-jest', // para que Jest entienda TypeScript
//   testEnvironment: 'node', // entorno de Node
//   testMatch: ['**/*.test.ts'], // busca directamente los tests .ts
//   modulePathIgnorePatterns: ['dist'], // ignora dist

//   setupFiles: ['<rootDir>/jest.setup.ts'],
//   // globals: {
//   //   'ts-jest': {
//   //     tsconfig: 'tsconfig.test.json'
//   //   }
//   // }
//   transform: {
//     '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
//   },
// };

// jest.config.cjs
// /** @type {import('jest').Config} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   testMatch: ['**/tests/unit/**/*.test.ts', '**/tests/integration/**/*.test.ts'],
//   modulePathIgnorePatterns: ['dist'],
//   setupFiles: ['<rootDir>/jest.setup.ts'], 
//   setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'], 
//   transform: {
//     '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
//   },
// };

// backend/jest.config.cjs
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/unit/**/*.test.ts',
    '**/tests/integration/**/*.test.ts'
  ],
  modulePathIgnorePatterns: ['dist'],

  // Se ejecuta antes de cualquier test
  setupFiles: ['<rootDir>/jest.setup.ts'],

  // Se ejecuta después de inicializar el entorno de Jest
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupIntegrationTests.ts'],

  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
};