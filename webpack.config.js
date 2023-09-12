const path = require('path');
const normalize = require('normalize-path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const stylesHandler = MiniCssExtractPlugin.loader;

const alias = {
  Src: path.resolve(__dirname, 'src'),
  App: path.resolve(__dirname, 'src/app'),
  Pages: path.resolve(__dirname, 'src/pages'),
  Layouts: path.resolve(__dirname, 'src/layouts'),
  Components: path.resolve(__dirname, 'src/components'),
  Modules: path.resolve(__dirname, 'src/modules'),
  Core: path.resolve(__dirname, 'src/core'),
  Assets: path.resolve(__dirname, 'src/core/assets'),
  Fonts: path.resolve(__dirname, 'src/core/assets/fonts'),
  Images: path.resolve(__dirname, 'src/core/assets/images'),
  Sprite: path.resolve(__dirname, 'src/core/assets/sprite'),
};

const getAssetsFilename = ({ filename }) => {
  const assetsDirname = 'assets';
  const assetsHostname = `src/core/${assetsDirname}`;

  const { dir, base } = path.parse(
    path.relative(assetsHostname, filename),
  );

  const result = dir ?
    path.join(assetsDirname, normalize(`${dir}/${base}`))
    : path.join(assetsDirname, base);

  return normalize(result);
};

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  stats: 'errors-only',
  resolve: {
    modules: ['node_modules'],
    alias,
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/index.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/index.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(svg)$/i,
        include: path.resolve(__dirname, 'src/core/assets/sprite'),
        type: 'asset/resource',
        generator: {
          filename: getAssetsFilename,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        include: path.resolve(__dirname, 'src/core/assets'),
        type: 'asset/resource',
        generator: {
          filename: getAssetsFilename,
        },
      },
    ],
  },
};

module.exports = config;
