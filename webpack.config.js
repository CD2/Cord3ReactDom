var path = require("path")
var webpack = require("webpack")

module.exports = {
  //   entry: ["babel-polyfill", "./src/index.js"],
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "script.js",
    publicPath: "/",
    library: "@cd2/cord-react-dom",
    libraryTarget: "umd",
  },
  devServer: {
    contentBase: "./build",
    hot: true,
  },
  target: "node",
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        loader: "babel-loader",
        query: {
          presets: ["env", "react"],
          plugins: [
            "transform-object-rest-spread",
            "transform-decorators-legacy",
            "transform-class-properties",
            "transform-do-expressions",
          ],
        },
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".jsx"],
  },
  stats: {
    colors: true,
  },
  externals: {
    react: "commonjs react",
    "react-dom": "commonjs react-dom",
    "mobx": "commonjs mobx",
    "mobx-react": "commonjs mobx-react",
  },
}
