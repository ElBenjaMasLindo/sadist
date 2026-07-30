# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-07-30

### Added
- Initial release: 4 architectural ESLint rules
  - `no-any-in-domain-types`
  - `no-null-in-domain-types`
  - `no-primitive-obsession`
  - `no-throw-outside-adapters`
- Strict ESLint config (`sadist/config/strict`)
- Pre-commit gate integration (build + lint + test)
- Example project (`examples/minimal-project`)
- CI workflow (GitHub Actions)
