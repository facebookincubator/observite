# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2026-07-14

### Fixed
- Published `observite-js/react` build files no longer import from the old `observite` package name at runtime; they now correctly import from `observite-js` (fixes module-resolution failures in consuming projects)
- Type declarations for `observite-js/react` now import types from `observite-js`
- `areEqual` no longer treats distinct `Date` or `RegExp` instances as equal (fix was previously in source but missing from the published build)

## [1.0.1] - 2026-02-24

### Changed
- Package renamed from `observite` to `observite-js` on npm (the `observite` name was taken)

## [1.0.0] - 2026-02-12

- Initial release of observite
