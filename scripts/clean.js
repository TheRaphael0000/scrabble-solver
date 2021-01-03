import fs from 'fs-extra';

const paths = [
  './npm-debug.log',
  './dictionaries',
  './dist',
  './packages/frontend/build',
  './packages/configs/node_modules',
  './packages/frontend/node_modules',
  './packages/logger/node_modules',
  './packages/solver/node_modules'
];

paths.forEach((path) => fs.remove(path));
