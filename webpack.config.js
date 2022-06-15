const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin') 
const MiniCssExtractPlugin = require('mini-css-extract-plugin') 
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
console.log('dev', isDev);
const isProd = !isDev

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

const babelOptions = preset => {
  const opts = {
      presets: ['@babel/preset-env']
  }

  if (preset)  {
    opts.presets.push(preset)
  }

  return opts
}

const plugins = () => {
  const base =  [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      // minify: {
      //   collapseWhitespace: isProd
      // }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/img/'),
          to: path.resolve(__dirname, 'build/img/')
        },
        {
          from: path.resolve(__dirname, 'src/files/'),
          to: path.resolve(__dirname, 'build/files/')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ]

  // if (isDev) {
  //   base.push(new BundleAnalyzerPlugin)
  // }

  return base
}


module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: './js/script.js',
    preview: './js/preview.js'
  },
  output: {
    // filename: 'bundle.js',
    filename: filename('js'),
    path: path.resolve(__dirname, 'build'),
    // assetModuleFilename: 'img/[name][ext]'
  },
  plugins: plugins(),
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 4200,
    hot: isDev,
    open: true
  },
  resolve: {
    // extensions: ['.js', '.json', 'png'],
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
      `...`,
    ],
  },
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        // use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/i,
        // loader: 'file-loader',
        // options: {
        //   name: '[path][name].[ext]'
        // },
        type: 'asset/resource',
        generator: {
            filename: '[path]/[name][ext]'
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        // use: ['file-loader']
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/i,
        use: ['csv-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions()
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript")
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react")
        }
      }
    ]
  }
}