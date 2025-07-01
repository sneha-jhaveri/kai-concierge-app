const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    extraNodeModules: {
      url: path.resolve(__dirname, 'node_modules/url-polyfill'), // Ensure correct resolution
    },
    // Block the problematic url.js file more precisely
    blockList: [
      new RegExp(
        `node_modules[/\\\\]socket\\.io-client[/\\\\]build[/\\\\]esm[/\\\\]url\\.js$`
      ),
    ],
  },
  server: {
    ...config.server,
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url.endsWith('.bundle')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
        middleware(req, res, next);
      };
    },
  },
  transformer: {
    ...config.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
