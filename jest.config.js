/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['src/'],
  verbose: true,
  silent: true,
  collectCoverage: true,
};
