// jest.config.cjs
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest', // para que Jest entienda TypeScript
  testEnvironment: 'node', // entorno de Node
  testMatch: ['**/*.test.ts'], // busca directamente los tests .ts
  modulePathIgnorePatterns: ['dist'], // ignora dist

  setupFiles: ['<rootDir>/jest.setup.ts'],
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.test.json'
  //   }
  // }
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
};
