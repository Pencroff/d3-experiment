/**
 * Created by Pencroff on 13-Dec-15.
 */
'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/app'
    },
    output: {
        path: __dirname + '/dist',
        publicPath: 'dist/',
        filename: '[name].js'
    },

    devtool: 'source-map',

    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
                presets: ['es2015'],
                plugins: ['transform-runtime']
            }
        }, {
            test: /\.css$/,
            loader: 'style!css'
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')
        }]
    },
    plugins: [
        // extract inline css into separate 'styles.css'
        new ExtractTextPlugin('styles.css')
    ],

    devServer: {
        host: 'localhost',
        port: 8815
    }
};
