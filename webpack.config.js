const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

// config created following a very nice guide from https://fullstackopen.com/en/part7/webpack

// build configuration for electron main file
const config_electron_main = (env, argv) => {
  const mode = argv.mode;
  return {
    target: 'electron-main', // for files that should be compiled for electron main process
    entry: ['./src/electron.js'],
    output: {
      filename: 'electron.js',
      path: __dirname + '/build'
    },
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'WEBPACK_MODE': JSON.stringify(mode)
        }
      })
    ]
  }
}

// build configuration for react files
const config_electron_react_renderer = (env, argv) => {
  return {
    // for files that should be compiled for electron renderer process
    target: 'electron-renderer', 
    // no need for polyfill for electron projects
    // as we targeting chrome anyway
    entry: [/*'@babel/polyfill',*/  './src/index.js'],
    output: {
      filename: 'index.js',
      path: __dirname + '/build'
    },
    devtool: 'source-map',
    // build directory contents will be served from dev-server to enable hot reload
    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
      compress: true,
      inline: true,
      port: 3111
    },
    // babel transpilers to transpile JSX and CSS
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            // presence of @babel/preset-env is also questionable
            // as we targeting chrome
            presets: ['@babel/preset-env' ,'@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader'],
        },
        // for css font-face loading
        { 
          test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
          loader: 'url-loader?limit=100000' 
        }
      ],
    },
    plugins: [
      // copy static files to build directory
      new CopyPlugin([
        {
          from: 'src/index.html',
          to: ''
        },
      ]),
    ]
  }
}

// important: export config with webpack-dev-server configuration first ! otherwise it gets lost
module.exports = [config_electron_react_renderer, config_electron_main];