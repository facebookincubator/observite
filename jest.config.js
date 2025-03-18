module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.[jt]s', // Match both .js and .ts files in __tests__ directories
    '**/?(*.)+(spec|test).[jt]s', // Match both .js and .ts files with .spec or .test suffix
  ],
  moduleFileExtensions: ['ts', 'js'], // Allow Jest to resolve both .ts and .js files
};
