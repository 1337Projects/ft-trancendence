'use strict';

module.exports = (_env, argv) => {
    const TerserPlugin = require('terser-webpack-plugin');
    const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");
    const path = require('path');
    const webpack = require('webpack');
    const fs = require('fs');

    const eula = "https://www.devexpress.com/Support/EULAs";

    const isProductionBuild = argv.mode === 'production';
    const pathToIndexTs = path.resolve(__dirname, 'src', 'index.ts');

    const entry = {};
    entry['dx-gantt'] = pathToIndexTs;
    if(isProductionBuild)
        entry['dx-gantt.min'] = pathToIndexTs;
    const plugins = [
        new MiniCssExtractPlugin({})
    ];

    if(isProductionBuild) {
        plugins.push(new webpack.BannerPlugin({
            banner: fs.readFileSync('./.license-header', 'utf8')
                .replace("[version]", require("./package.json").version)
                .replace("[year]", new Date().getFullYear())
                .replace("[eula]", eula)
                .replace("[date]", new Date().toDateString()),
            test: /\.(js|css|scss)$/
            }));
    }

    return {
        mode: isProductionBuild ? 'production' : 'development',
        devtool: isProductionBuild ? false :'inline-source-map',
        entry: entry,
        output: {
            library: ["DevExpress", 'Gantt'],
            libraryTarget: "umd",
            filename: './[name].js',
            path: path.resolve(__dirname, 'dist'),
            globalObject: 'this'
        },
        performance: {
            hints: false,
            maxEntrypointSize: 2048000,
            maxAssetSize: 2048000
        },
        module: {
            rules: [
                {
                    test : /\.scss$/,
                    use : [
                        { loader: MiniCssExtractPlugin.loader },
                        {
                            loader: 'css-loader',
                            options: {
                                url: false
                            }
                        },
                        { loader: 'sass-loader' }
                    ]
                },
                {   
                    test: /\.tsx?$/,
                    use: 'ts-loader'
                },
            ]
        },
        resolve: {
            extensions: [ '.ts', '.tsx', '.js', '.scss' ]
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    test: /\.min\.js$/
                }),
                new CssMinimizerPlugin({
                    test: /\.min\.css$/g
                })
            ]
        },
        plugins: plugins
    }
};
