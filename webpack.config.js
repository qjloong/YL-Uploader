/**
 * Created by ylicloud on 16/8/11.
 */
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var node_modules_dir = path.join(__dirname, 'node_modules');

module.exports = {
    entry: {
        upload: './src/app/upload/main.js',
    },
    output: {
        path: './build/public/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'ng-annotate!babel',
                //query: {
                //    presets: ['es2015']
                //},
                exclude: /node_modules/
            },
            {
                test: /\.less/,
                loader: ExtractTextPlugin.extract('style', 'css!less')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.(png|jpg|jpeg|gif)/,
                loader: 'url?limit=6500&name=img/[name]_[hash:8].[ext]'
            },
            {
                test: /\.(svg|woff|woff2|ttf|eot|swf|csv)/,
                loader: 'file?name=font/[name]_[hash:8].[ext]'
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            //{
            //    test: /\.htm$/,
            //    loader: 'file?name=pdf/web/[name].html'
            //}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/app/upload/index.html',
            inject: 'body',
            chunks: ['upload']
        }),
        new ExtractTextPlugin('[name].css'),
        //new webpack.optimize.UglifyJsPlugin()
    ]
};