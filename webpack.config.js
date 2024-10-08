const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[contenthash].js',
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
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[hash:8].[ext]'
            },
          },
        ],
      },
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
      // changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    }, {
      context: ['/socket.io'],

      target: 'http://localhost:8080',
      // target: 'http://192.168.0.223:8080',
      // target: 'http://192.168.0.182:8080',
      ws:true
    }
    ]
  },
};