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
        home: './src/app/home/main.js'
        //upload: './src/app/upload/main.js',
    },
    target: 'node-webkit',
    output: {
        path: './build',
        filename: '[name].js'
    },
    externals: {
        express: 'commonjs express',
        multer: 'commonjs multer'
    },
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'ng-annotate!babel?presets[]=es2015',
                exclude: /node_modules/
            },
            //{
            //    test: /\.less/,
            //    loader: 'style!css!less'
            //},
            //{
            //    test: /\.less/,
            //    loader: ExtractTextPlugin.extract('style', 'css!less')
            //},
            //{
            //    test: /\.css$/,
            //    loader: 'style!css'
            //},
            //{
            //    test: /\.css$/,
            //    loader: ExtractTextPlugin.extract('style', 'css')
            //},
            //{
            //    test: /\.(png|jpg|jpeg|gif|ico)/,
            //    loader: 'url?limit=6500&name=img/[name].[ext]'
            //},
            //{
            //    test: /\.(svg|woff|woff2|ttf|eot|swf|csv)/,
            //    loader: 'file?name=font/[name].[ext]'
            //},
            //{
            //    test: /\.html$/,
            //    loader: 'html'
            //}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'home.html',
            template: 'src/app/home/home.html',
            inject: 'body',
            chunks: ['home']
        }),
        new ExtractTextPlugin('[name].css'),
        //new webpack.optimize.UglifyJsPlugin()
    ]
};