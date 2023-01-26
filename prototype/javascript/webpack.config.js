const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool:"inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode:"development",
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};