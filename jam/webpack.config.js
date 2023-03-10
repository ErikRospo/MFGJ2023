const path = require('path')

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ru?le$/,
        use: './rle-loader.js'
      },
      {
        test: /\.mp3$/,
        type: 'asset/resource'
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.rle']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 9000,
    client: {
      progress: true
    }
  },
  watchOptions: {
    ignored: /node_modules/
  }
}
