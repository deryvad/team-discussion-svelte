const path = require('path')
const { merge } = require('webpack-merge')
const { mode } = require('webpack-nano/argv')
const parts = require('./webpack.parts')

const common = merge([
    { output: { path: path.resolve(process.cwd(), 'dist') } },
    parts.page({ title: 'Flywheel' }),
    parts.svelte(mode),
    parts.extractCSS({ loaders: [parts.postcss()] })
])

const development = merge([
  { entry: ['./src/main.js', 'webpack-plugin-serve/client'] },
  { target: 'web' },
  parts.generateSourceMaps({ type: 'eval-source-map' }),
  parts.devServer()
])

const production = merge([])

const getConfig = mode => {
  switch (mode) {
    case 'production':
      return merge(common, production, { mode })
    case 'development':
      return merge(common, development, { mode })
    default:
      throw new Error(`Unknown mode, ${mode}`)
  }
}

module.exports = getConfig(mode)