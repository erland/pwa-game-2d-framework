/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],

  // Transform TS/TSX via Babel
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],

  // Pick up tests co-located under src/**/__tests__/**
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{test,spec}.{ts,tsx}'],

  moduleNameMapper: {
    '^phaser$': '<rootDir>/__mocks__/phaser.ts',
  },
};