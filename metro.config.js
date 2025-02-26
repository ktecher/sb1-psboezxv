const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add web platform
config.resolver.platforms = [...config.resolver.platforms, 'web'];

// Configure module resolution
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs'],
  resolverMainFields: ['browser', 'react-native', 'main'],
  // Ensure proper alias resolution
  extraNodeModules: new Proxy({}, {
    get: (target, name) => path.join(process.cwd(), `node_modules/${name}`)
  })
};

module.exports = config;