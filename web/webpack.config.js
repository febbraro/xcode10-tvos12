const path = require('path');
const merge = require('webpack-merge');

function resolveFromRoot(dir) {
  return path.resolve(__dirname, dir);
}

const rules = [
  {
    test: /\.js$/,
    exclude: /(node_modules|tvdml\/dist)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          'react',
        ],
        plugins: [
          'transform-class-properties',
          'transform-object-rest-spread',
          'react-require',
        ],
        cacheDirectory: true,
      },
    },
  },
  {
    test: /\.css$/,
    use: [
      'css-loader',
    ],
  },
  {
    test: /\.(png|jpe?g)$/i,
    use: {
      loader: 'file-loader',
      options: {
        name: 'assets/[name].[hash].[ext]',
        publicPath: '/',
      },
    },
  },
  {
    test: /\.json$/i,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    },
  },
];

const stats = {
  modules: false,
  chunks: false,
  colors: true,
};

const sharedConfig = {
  entry: {
    application: resolveFromRoot('./src'),
  },
  output: {
    filename: '[name].js',
    path: resolveFromRoot('./dist'),
  },
  devtool: 'eval-source-map',
  module: { rules },
  stats,
  devServer: {
    contentBase: resolveFromRoot('./dist'),
    compress: true,
    inline: false,
    port: 9001,
    stats,
  },
};

const env = process.env.NODE_ENV;
const devConfig = require('./config/webpack.config.dev.js');
const prodConfig = require('./config/webpack.config.prod.js');

let config;
switch (env) {
  case 'prod':
    config = merge(sharedConfig, prodConfig);
    break;
  case 'dev':
  default:
    config = merge(sharedConfig, devConfig);
}

module.exports = config;
