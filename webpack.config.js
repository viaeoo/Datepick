const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const getPackageJson = require('./script/getPackageJson');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const {
  version,
  name,
  license,
  repository,
  author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const banner = `
  ${name} v${version}
  ${repository.url}

  Copyright (c) ${author.replace(/ *\<[^)]*\> */g, ' ')}

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;

let outputFile;

if (process.env.NODE_ENV === 'production') {
  outputFile = `${name}.min.js`;
} else {
  outputFile = `${name}.js`;
}

const DtsBundlePlugin = function () {};
DtsBundlePlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function () {
    const dts = require('dts-bundle');

    dts.bundle({
      name: name.replace(/^./, name[0].toUpperCase()),
      main: './dist/**/*.d.ts',
      out: `${name}.d.ts`,
      removeSource: true,
      outputAsModuleFolder: true,
      headerText: banner,
    });

    fs.rmdirSync('./dist/scripts', { recursive: true });
  });
};

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'none',
  entry: './src/datepick.ts',
  output: {
    filename: outputFile,
    path: path.resolve(__dirname, 'dist'),
    library: name.replace(/^./, name[0].toUpperCase()),
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'ts-loader',
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
              ],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          'url-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      'jsx',
      '.ts',
      '.tsx',
    ],
    alias: {
      '@src': path.resolve(__dirname, './src/'),
    },
  },
  devServer: {
    host: '127.0.0.1',
    port: 9000,
    hot: true,
    inline: true,
    watchContentBase: true,
    clientLogLevel: 'none',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: banner,
      entryOnly: true,
    }),
    new MiniCssExtractPlugin({
      filename: process.env.NODE_ENV === 'production' ? `${name}.min.css` : `${name}.css`,
    }),
    new StyleLintPlugin(),
    new DtsBundlePlugin(),
  ],
};
