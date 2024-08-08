const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    static: [
      path.join(__dirname, 'dist'),
      path.join(__dirname, 'public')
    ],
    compress: true,
    port: 9000,
    historyApiFallback: true,
    client: {
      overlay: false,
      
    },
    allowedHosts: ['.ngrok-free.app', 'localhost'],
    proxy: [{
      context: ['/api'],
      target: 'http://localhost:8000',
      secure: false,
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    }, {
      context: ['/socket.io'],
      target: 'http://34.64.241.5:38080',
      ws:true
    }
    ]
  },
};