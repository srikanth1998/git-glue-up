const path = require('path');

module.exports = {
  target: 'electron-main',
  mode: 'production',
  entry: './dist/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  externals: {
    'ws': 'commonjs ws',
    'electron': 'commonjs electron'
  },
<<<<<<< HEAD
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
=======
>>>>>>> 803b9ff525c2282fe6eeedb4b0dc1aace7c61c03
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  }
};