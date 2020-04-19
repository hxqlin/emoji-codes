const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

const config = {
  devtool: "cheap-module-source-map",
  context: __dirname,
  entry: {
    content: "./src/content.jsx",
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|j?g|svg|gif)?$/,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
};

module.exports = config;
