const webpack = require("webpack")
const path = require("path")
const srcDir = path.join(__dirname, "..", "src/")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  entry: {
    popup: path.join(srcDir + "popup.tsx"),
    background: path.join(srcDir + "background.ts"),
    options: path.join(srcDir + "options.tsx"),
    hot_reload: path.join(srcDir + "hot_reload.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),
  ],
}
