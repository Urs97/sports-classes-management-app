import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'test/.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['test/**/*.(t|j)s'],
  coverageDirectory: './coverage/e2e',
  testEnvironment: 'node',
  setupFilesAfterEnv: ["<rootDir>/test/utils/setup-e2e.ts"],
};

export default config;