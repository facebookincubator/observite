/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ts = require('typescript');
const { pathsToModuleNameMapper } = require('ts-jest');
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
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.[jt]s', // Match both .js and .ts files in __tests__ directories
    '**/?(*.)+(spec|test).[jt]s', // Match both .js and .ts files with .spec or .test suffix
  ],
  testPathIgnorePatterns: [
    "\\.d\\.ts$", // ignore .d.ts files
    "/dist/", // ignore compiled output in dist folder
    "/lib/", // ignore bundled output in lib folder
    "/node_modules/", // ignore node_modules
    "type-compatibility\\.test\\.ts$" // ignore type-only compile tests (run with npm run test:types)
  ],
  moduleFileExtensions: ['ts', 'js'], // Allow Jest to resolve both .ts and .js files
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};
