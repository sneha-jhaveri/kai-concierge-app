const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    extraNodeModules: {
      url: require.resolve('url-polyfill'), // Mock the 'url' module for socket.io-client
    },
    blockList: [/node_modules\/socket.io-client\/build\/esm\/url\.js/], // Block the problematic file
  },
  server: {
    ...config.server,
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url.endsWith('.bundle')) {
          res.setHeader('Content-Type', 'application/javascript'); // Fix MIME type
        }
        middleware(req, res, next);
      };
    },
  },
};
