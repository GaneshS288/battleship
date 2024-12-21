const { merge } = require("webpack-merge");
const config = require("./webpack.config.cjs");

module.exports = merge(config, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src"],
    open: {
      app: {
        name: "/mnt/c/program files/google/chrome/application/chrome.exe",
      },
    },
  },
});
