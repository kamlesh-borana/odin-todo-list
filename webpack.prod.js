const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const path = require("path");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "source-map",
});
