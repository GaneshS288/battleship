const path = require("path");
const HtmlWbpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
  },

  plugins: [
    new HtmlWbpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.(woff|ttf|woff2|otf|oot)$/i,
        type: "asset/resource",
      },

      {
        test: /\.(jpg|gif|png|svg|jpeg)$/i,
        type: "asset/resource",
      },

      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
    ],
  },

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
};
