const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    extraNodeModules: {
      url: path.resolve(__dirname, 'node_modules/url-polyfill/dist/index.js'),
      'socket.io-client': path.resolve(
        __dirname,
        'node_modules/socket.io-client/dist/socket.io.js'
      ),
    },
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'socket.io-client') {
        console.log(
          'Resolving socket.io-client to:',
          path.resolve(
            __dirname,
            'node_modules/socket.io-client/dist/socket.io.js'
          )
        );
        return {
          filePath: path.resolve(
            __dirname,
            'node_modules/socket.io-client/dist/socket.io.js'
          ),
          type: 'sourceFile',
        };
      }
      if (moduleName === 'url') {
        console.log(
          'Resolving url to:',
          path.resolve(__dirname, 'node_modules/url-polyfill/dist/index.js')
        );
        return {
          filePath: path.resolve(
            __dirname,
            'node_modules/url-polyfill/dist/index.js'
          ),
          type: 'sourceFile',
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
    blockList: [
      // Block all ESM and CJS files in socket.io-client/build
      new RegExp(`node_modules[/\\\\]socket\\.io-client[/\\\\]build[/\\\\].*`),
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
