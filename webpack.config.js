const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        'lucide-react-native',
        '@expo/vector-icons',
        'react-native-reanimated',
        'react-native-maps'
      ]
    }
  }, argv);

  // Configure module resolution
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      'react-native-maps': 'react-native-web-maps',
      '@': path.resolve(__dirname),
      // Add these specific aliases
      'expo-router': require.resolve('expo-router'),
      'react-native-safe-area-context': require.resolve('react-native-safe-area-context'),
      'react-native-screens': require.resolve('react-native-screens')
    },
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', ...config.resolve.extensions],
    fallback: {
      ...config.resolve.fallback,
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/")
    }
  };

  return config;
};