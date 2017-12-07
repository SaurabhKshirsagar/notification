// Karma configuration
// Generated on Sat Mar 19 2016 20:32:50 GMT+0530 (India Standard Time)
var
 webpack = require("webpack"),
 path = require('path');

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'client/**/*.spec.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'client/**/*.spec.js': ['webpack', 'sourcemap']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        mochaReporter: {
            output: 'autowatch'
        },

        coverageReporter: {
            type: 'html',
            dir: './coverage/'
        },

        webpack: {
            node: {
                fs: 'empty'
            },
            devtool: 'inline-source-map', //just do inline source maps instead of the default
            // *optional* isparta options: istanbul behind isparta will use it

            isparta: {
                embedSource: true,
                noAutoWrap: true
                /*
                // these babel options will be passed only to isparta and not to babel-loader
                babel: {
                    presets: ['es2015']
                }
                */
            },
            module: {
                preLoaders: [
                    {
                        test: /\.js$/,
                        loader: 'isparta',
                        include: /client/
                    }
                ],
                loaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        loader: 'babel',
                        query: {
                            presets: ['es2015', 'react']
                        }
                    },
                    {
                        test: /\.json$/,
                        exclude: /node_modules/,
                        loader: 'json'
                    },
                ]
            },
            resolve: {
                alias: {
                    'react': path.join(__dirname, 'node_modules', 'react'),
                    'styles': path.join(__dirname, 'client', 'styles'),
                    'engine': path.join(__dirname, 'client', 'js', 'engine'),
                    'helpers': path.join(__dirname, 'client', 'js', 'helpers'),
                    'components': path.join(__dirname, 'client', 'js', 'components'),
                    'images': path.join(__dirname, 'client', 'images'),
                    'actions': path.join(__dirname, 'client', 'js', 'actions'),
                    'appcontext': path.join(__dirname, 'client', 'js', 'appcontext')
                },
                extensions: ['', '.js', '.json']
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true
        }
    })
}