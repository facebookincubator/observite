const ts = require('typescript');
const { pathsToModuleNameMapper } = require('ts-jest');
// const { compilerOptions } = require('@/tsconfig');
const configFileName = ts.findConfigFile(
  "./",
  ts.sys.fileExists,
  "tsconfig.json"
);
if (!configFileName) {
  throw new Error("Could not find a valid 'tsconfig.json'.");
}
const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
if (configFile.error) {
  throw new Error(ts.formatDiagnosticsWithColorAndContext([configFile.error], {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
  }));
}
const {options: compilerOptions} = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  "./"
);
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.[jt]s', // Match both .js and .ts files in __tests__ directories
    '**/?(*.)+(spec|test).[jt]s', // Match both .js and .ts files with .spec or .test suffix
  ],
  moduleFileExtensions: ['ts', 'js'], // Allow Jest to resolve both .ts and .js files
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};
