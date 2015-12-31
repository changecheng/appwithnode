module.exports = {
    entry: {
      // index:"./index.js",
      // signup:"./signup.js",
      // welcome:"./welcome.js",
      // default:"./blog/default.js",
      test:"./test.js"
    },
    output: {
        path: __dirname+'/dist',
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: "url?limit=100000" },
            { test: /\.css$/, exclude: /(node_modules|bower_components)/,loader: "style!css" },
            {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel',
              query: {
                presets: ['react'],
                cacheDirectory:true
              }
            }


        ]
    }
};