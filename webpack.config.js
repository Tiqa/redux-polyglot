const path = require('path');

const APP_ROOT = path.normalize(__dirname);
const entry = {
    'redux-polyglot': path.join(APP_ROOT, 'src', 'index.js'),
};
const output = {
    path: path.join(APP_ROOT, 'dist'),
    filename: '[name].js',
};

module.exports = {
    entry,
    output,
    module: {
        loaders: [
            {
                test: /\.(js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: /src/,
            },
        ],
    },
};
