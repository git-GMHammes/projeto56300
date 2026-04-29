const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = path.resolve(__dirname);

const config = {
  projectRoot,
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    blockList: [
      /android[\\/]\.gradle.*/,
      /android[\\/]app[\\/]build.*/,
      /android[\\/]build.*/,
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
