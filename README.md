&nbsp;

<p align="center">
  <img height="250" src="resources/icon.png"/>
</p>
&nbsp;

# AccessiByeBye

[![Build](https://github.com/PneumaSolutions/AccessiByeBye/actions/workflows/build.yml/badge.svg)](https://github.com/PneumaSolutions/AccessiByeBye/actions/workflows/build.yml)

Web accessibility overlays don't work. Wave them all bye-bye in one easy step, with AccessiByeBye!

## Prerequisites

- [yarn](https://yarnpkg.com) (>=1.22.4)

## Built with

- TypeScript
- Webpack
- React
- Chrome Extensions API
  - Manifest V2
  - Chrome Storage
  - Chrome webRequest

## Project Structure

- src: TypeScript source files
- public: Static files
- resources: Icon files for distribution
- dist: Chrome Extension directory
- dist/js: Generated JavaScript files

## Setup

```bash
yarn install
```

## Build for production

```bash
yarn build
```

## Build in watch mode

```bash
yarn watch
```

## Load extension to chrome

Load `dist` directory
