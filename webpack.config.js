'use strict';

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  return {
    context: __dirname, // to automatically find tsconfig.json
    devtool: 'source-map',
    entry: {
      authoring: './src/components/authoring/authoring-app',
      plugin: './src/plugin.tsx',
    },
    output: {
      filename: '[name].js',
    },
    mode: 'development',
    performance: { hints: false },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          enforce: 'pre',
          use: [
            {
              loader: 'eslint-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true // IMPORTANT! use transpileOnly mode to speed-up compilation
          }
        },
        {
          test: /\.(sa|sc|c)ss$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]--[local]--TETipsPluginV1'
                },
                sourceMap: true,
                importLoaders: 1
              }
            },
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(png|woff|woff2|eot|ttf)$/,
          loader: 'url-loader'
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack']
        }
      ]
    },
    resolve: {
      extensions: [ '.ts', '.tsx', '.js' ]
    },
    stats: {
      // suppress "export not found" warnings about re-exported types
      warningsFilter: /export .* was not found in/
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {from: 'src/public'}
        ]
      })
    ],
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      '@concord-consortium/lara-plugin-api': 'LARA.PluginAPI_V3'
    },
    devServer: {
      before: (app, server) => {
        app.post('*', (req, res) => {
            res.redirect(req.originalUrl);
        });
      }
    }
  };
};
