&nbsp;
<p align="center">
  <img height="250" src="resources/icon.svg"/>
</p>
&nbsp;

# Chrome Extension TypeScript Starter

[![Build](https://github.com/dcalvo/chrome-extension-typescript-starter/actions/workflows/build.yml/badge.svg)](https://github.com/dcalvo/chrome-extension-typescript-starter/actions/workflows/build.yml)

Chrome Extension, TypeScript and Visual Studio Code

## Prerequisites

* [node](https://nodejs.org/)+[yarn](https://yarnpkg.com) (Current Versions)

## Option

* [Visual Studio Code](https://code.visualstudio.com/)

## Includes the following

* TypeScript
* Webpack
* React
* Jest
* Example Code
    * Chrome Storage
    * Options Version 2
    * content script
    * count up badge number
    * background

## Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```
yarn
```

## Import as Visual Studio Code project

...

## Build

```
yarn build
```

## Build in watch mode

### terminal

```
yarn watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory

## Test
`npx jest` or `yarn test`
