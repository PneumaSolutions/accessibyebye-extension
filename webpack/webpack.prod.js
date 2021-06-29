const merge = require("webpack-merge")
const common = require("./webpack.common.js")
const CopyPlugin = require("copy-webpack-plugin")

// Overwrite manifest.json with production settings
function modify(buffer) {
  // copy-webpack-plugin passes a buffer
  var manifest = JSON.parse(buffer.toString())

  // remove hot_reload.js
  manifest.background.scripts = manifest.background.scripts.slice(0, 2)

  // pretty print to JSON with two spaces
  manifest_JSON = JSON.stringify(manifest, null, 2)
  return manifest_JSON
}

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./manifest.json",
          to: "../",
          context: "public",
          force: true,
          transform(content, path) {
            return modify(content)
          },
        },
      ],
    }),
  ],
})
