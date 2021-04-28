const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== 'production';
const distPath = path.resolve(__dirname, 'dist');

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: ['./src/index.tsx'],
  output: {
    path: distPath,
    filename: 'index.js',
    clean: true,
    libraryTarget: 'system',
  },
  externals: ['@kaaiot/services'],
  plugins: [
    new CopyPlugin({ 
      patterns: [
        { from: "widget.json", to: distPath },
        { 
          from: "src/assets/*",
          to() {
            return "[name][ext]";
          }, 
        },
      ],
    }),
  ],
  devtool: isDevelopment ? 'cheap-source-map' : 'source-map',
  devServer: {
    static: distPath,
    port: 5000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader"},
          { 
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ["postcss-preset-env"],
                ],
              },
            }
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
