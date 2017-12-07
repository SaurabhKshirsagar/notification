var webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path'),
    
    plugins = [
        new HtmlWebpackPlugin({
            "template": "./client/index.html",
            "inject": true,
            "hash": true,
            "minify": {
                "collapseWhitespace": true,
                "removeRedundantAttributes": true,
                "removeAttributeQuotes": true,
                "minifyCSS": true
            }
        }),
        new ExtractTextPlugin("styles.min.css", { allChunks: true }),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
        new webpack.HotModuleReplacementPlugin()
    ];

module.exports = {
    entry: {
        javascript: ["babel-polyfill","./client/startup.js", "webpack-hot-middleware/client"],
        vendor: [
            "react",
            "react-dom",
            "react-addons-css-transition-group",
            "react-addons-pure-render-mixin",
            "react-router",
            "react-gravatar",
            "reflux/src/connect",
            "reflux-core",
            "reflux-core/lib/createStore"          
        ]
    },
  
    module: {
        loaders: [
             {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            /*{ 
                test: /\.json$/,
                exclude: /node_modules/, 
                loader: 'json'
            },*/
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=100000"
            },
            {
                test: /\.jpg$/,
                loader: "file-loader"
            }, 
             {
                 test: /\.json$/,
                 loader: 'json-loader'
            },
            
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },
    plugins: plugins,
    output: {
        filename: "bundle.js",
      //  path: "./build"
      path:require("path").resolve("./build"),
      chunkFilename: '[name]-[hash].js'
    },
    resolve: {
        alias: {
            'react': path.join(__dirname, 'node_modules', 'react'),
            'styles': path.join(__dirname, 'client', 'styles'),
            'engine': path.join(__dirname,'client','js','engine'),
            'helpers': path.join(__dirname,'client','js','helpers'),
            'components': path.join(__dirname,'client','js','components'),
            'images': path.join(__dirname,'client','images'),
            'actions': path.join(__dirname,'client','js','actions'),
            'appcontext': path.join(__dirname,'client','js','appcontext')
        },
        extensions: ['', '.js','.json']
    }
};           