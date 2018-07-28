var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    target: "web",
    entry: {
        app: "./src/app.tsx"
    },
    output: {
        filename: "src/[name].js",
        libraryTarget: "amd"
    },
    externals: [
        /^VSS\/.*/, /^TFS\/.*/, /^q$/
    ],
    devtool: "inline-source-map",
    resolve: {
        extensions: [
            ".webpack.js",
            ".web.js",
            ".ts",
            ".tsx",
            ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.s?css$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    devServer: {
        https: true
    },
    plugins: [
    	new UglifyJsPlugin({sourceMap: false, uglifyOptions: { ecma: 6, compress: true, output: { comments: false, beautify: false } }}),
        new CopyWebpackPlugin([
            { from: "./node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js", to: "libs/VSS.SDK.min.js" },
            { from: "./node_modules/es6-promise/dist/es6-promise.min.js", to: "libs/es6-promise.min.js" },
            { from: "./node_modules/office-ui-fabric-react/dist/css/fabric.min.css", to: "libs/fabric.min.css" },
            { from: "./src/*.html", to: "./" },
            { from: "./images", to: "images" },
            { from: "./vss-extension.json", to: "vss-extension.json" },
            { from: "./overview.md", to: "overview.md" }
        ])
    ]
}