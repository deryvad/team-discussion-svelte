const path = require('path')
const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin')
const { WebpackPluginServe } = require('webpack-plugin-serve')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const preprocess = require('svelte-preprocess')

exports.devServer = () => ({
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: 3000,
      static: path.resolve(process.cwd(), 'dist'),
      historyFallback: true
    })
  ]
})

exports.page = ({ title }) => ({
  plugins: [new MiniHtmlWebpackPlugin({ publicPath: '/', context: { title } })]
})

exports.generateSourceMaps = ({ type }) => ({ devtool: type })

exports.svelte = mode => {
    const prod = mode === 'production'
  
    return {
      resolve: {
        alias: {
          svelte: path.dirname(require.resolve('svelte/package.json'))
        },
        extensions: ['.mjs', '.js', '.svelte', '.ts'],
        mainFields: ['svelte', 'browser', 'module', 'main']
      },
      module: {
        rules: [
          {
            test: /\.svelte$/,
            use: {
              loader: 'svelte-loader',
              options: {
                compilerOptions: {
                  dev: !prod
                },
                emitCss: prod,
                hotReload: !prod,
                preprocess: preprocess({
                  postcss: true
                })
              }
            }
          },
          {
            test: /node_modules\/svelte\/.*\.mjs$/,
            resolve: {
              fullySpecified: false
            }
          }
        ]
      }
    }
  }

  exports.postcss = () => ({
    loader: 'postcss-loader'
  })
  
  exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
    return {
      module: {
        rules: [
          {
            test: /\.(p?css)$/,
            use: [{ loader: MiniCssExtractPlugin.loader, options }, 'css-loader'].concat(
              loaders
            ),
            sideEffects: true
          }
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css'
        })
      ]
    }
  }