const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebExtPlugin = require('web-ext-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const isDevelopment = process.env.NODE_ENV === 'development'

const commonConfig = {
  // No need for uglification etc.
  mode: 'production', //process.env.NODE_ENV,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/,]
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader',
      exclude:[/node_modules/,]
     },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

const commonExtConfig = {
  ...commonConfig,
  entry: {
    'content': './src/content.ts',
    'background': './src/background.ts',
    'popup': './src/popup.ts',
    'options': './src/options.ts',
    'mystyles': './scss/mystyles.scss'
  },
};

const getPreprocessorConfig = (...features) => ({
  test: /\.src$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name]',
      },
    },
    {
      loader:
        'webpack-preprocessor?' +
        features.map(feature => `definitions[]=${feature}`).join(','),
    },
  ],
});

const extendArray = (array, ...newElems) => {
  const result = array.slice();
  result.push(...newElems);
  return result;
};

const thunderbirdConfig = {
  ...commonExtConfig,
  module: {
    ...commonExtConfig.module,
    rules: extendArray(
      commonExtConfig.module.rules,
      getPreprocessorConfig(
        'supports_svg_icons',
        'supports_browser_style',
        'supports_applications_field'
      )
    ),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  plugins: [
    new WebExtPlugin({ 
      sourceDir: path.resolve(__dirname, 'dist'),
    }),
    new CopyPlugin({
      patterns: [
      // 'images/*',
      // '_locales/**/*',
      'manifest.json'
    ]}),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "css/[name].css" : "css/[name].css",
      chunkFilename: isDevelopment ? "css/[id].css" : "css/[id].[hash].css"
    }),
    new Dotenv(),
  ],
};

module.exports = (env, argv) => {
  let configs = [];
  // let configs = [commonConfig];
  configs.push({ ...thunderbirdConfig, name: 'extension' });

  return configs;
};