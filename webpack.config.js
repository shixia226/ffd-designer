const path = require('path');

module.exports = {
    entry: {
        index: './index.js'
    },
    output: {
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /(\.js|\.vue)$/,
            exclude: /(node_modules|bower_components)(?!.*webpack-dev-server)/,
            loader: 'babel-loader',
            query: {
                "presets": ["env"],
                "plugins": ["transform-vue-jsx"]
            }
        }]
    }
};