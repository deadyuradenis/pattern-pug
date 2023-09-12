const gulp = require('gulp');

const rename = require('gulp-rename');
const del = require('del');
const deploy = require('gh-pages');

const pug = require('gulp-pug');
const prettyHtml = require('gulp-pretty-html');

const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const imagemin = require('gulp-imagemin');
const spriteBuilder = require('gulp-svg-sprite');
const svgCleaner = require('gulp-cheerio');

const browserSync = require('browser-sync').create();

const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const browserSyncReload = browserSync.reload;

const transformFontsMap = {
  'woff': ttf2woff,
  'woff2': ttf2woff2,
};

const globs = {
  module: 'src/app/index.js',
  pages: 'src/pages/**/*.pug',
  transformFonts: '.transform/fonts/**/*.ttf',
  fontsBase: 'src/core/assets/fonts',
  fonts: 'src/core/assets/fonts/**/*',
  imagesBase: 'src/core/assets/images',
  images: 'src/core/assets/images/**/*',
  sprite: 'src/core/assets/sprite/**/*.svg',
  public: 'public/',
  publicPages: 'public/*.html',
  publicFonts: 'public/assets/fonts',
  publicImages: 'public/assets/images',
  publicSprites: 'public/assets/sprite',
};

const watchingGlobs = {
  js: ['src/**/*.js', '!src/**/*.stories.js'],
  css: ['src/**/*.s[ca]ss'],
  pug: ['src/**/*.pug'],
  fonts: ['src/core/assets/fonts/**/*.ttf'],
  images: ['src/core/assets/images/**/*'],
  sprite: ['src/core/assets/sprite/**/*.svg'],
};

const transformFontsBuilder = (format) => {
  return (cb) => {
    const transformUtil = transformFontsMap[format];

    return gulp.src(globs.transformFonts)
      .pipe(transformUtil())
      .pipe(gulp.dest(globs.fontsBase))
      .on('end', cb)
      .on('error', cb);
  }
};

const mergeSvgBuilder = (mode) => {
  return (cb) => {
    const pipeline = gulp.src(globs.sprite);

    if (mode === 'clean') {
      pipeline.pipe(svgCleaner({
        run: ($) => {
          $('[fill]').removeAttr('fill');
          $('[style]').removeAttr('style');
          $('[stroke]').removeAttr('stroke');
        },
        parserOptions: { xmlMode: true },
      }));
    }

    pipeline
      .pipe(spriteBuilder({
        shape: {
          dimension: {
            maxWidth: 48,
            maxHeight: 48,
          },
        },
        mode: {
          symbol: {
            dest: mode,
            inline: true,
            sprite: './sprite.svg',
          },
        },
      }))
      .pipe(gulp.dest(globs.publicSprites))
      .on('end', cb)
      .on('error', cb);

    return pipeline;
  };
};

function cleanPublic() {
  return del([globs.public]);
};

function setProductionEnv(cb) {
  process.env.NODE_ENV = 'production';

  cb();
};

function runDeploy(cb) {
  deploy.publish(globs.public, {
    branch: 'build',
    message: 'chore: build project',
  }, cb);
};

function prettifyTemplates(cb) {
  return gulp.src(globs.publicPages)
    .pipe(prettyHtml({
      indent_size: 2,
    }))
    .pipe(gulp.dest(globs.public))
    .on('end', cb)
    .on('error', cb);
};

function upServer(cb) {
  browserSync.init({
    server: './public',
    logLevel: 'silent',
    open: 'external',
    ui: false,
  });

  cb();
};

function compileTemplates(cb) {
  return gulp.src(globs.pages)
    .pipe(pug())
    .pipe(gulp.dest(globs.public))
    .on('end', cb)
    .on('error', cb);
};

function compileModules(cb) {
  return gulp
    .src(globs.module)
    .pipe(webpackStream(require('./webpack.config.js'), webpack)) // eslint-disable-line global-require
    .pipe(gulp.dest(globs.public))
    .on('end', cb)
    .on('error', cb);
};

function transformFonts2Woff(cb) {
  return transformFontsBuilder('woff')(cb);
};

function transformFonts2Woff2(cb) {
  return transformFontsBuilder('woff2')(cb);
};

function transformFonts() {
  return gulp.parallel(
    transformFonts2Woff,
    transformFonts2Woff2,
  );
};

function copyFonts(cb) {
  return gulp.src(globs.fonts)
    .pipe(gulp.dest(globs.publicFonts))
    .on('end', cb)
    .on('error', cb);
};

function optimizeImages(cb) {
  return gulp.src(globs.images)
    .pipe(imagemin())
    .pipe(gulp.dest(globs.imagesBase))
    .on('end', cb)
    .on('error', cb);
};

function copyImages(cb) {
  return gulp.src(globs.images)
    .pipe(gulp.dest(globs.publicImages))
    .on('end', cb)
    .on('error', cb);
};

function mergeSvgAsClean(cb) {
  return mergeSvgBuilder('clean')(cb);
};

function mergeSvgAsDefault(cb) {
  return mergeSvgBuilder('default')(cb);
};

function mergeSvg() {
  return gulp.parallel(
    mergeSvgAsClean,
    mergeSvgAsDefault,
  );
};

function watchFiles() {
  gulp.watch(
    [...watchingGlobs.pug],
    compileTemplates,
  ).on('change', browserSyncReload);

  gulp.watch(
    [
      ...watchingGlobs.js,
      ...watchingGlobs.css,
    ],
    compileModules,
  ).on('change', browserSyncReload);

  gulp.watch(
    [
      ...watchingGlobs.images,
    ],
    gulp.series(
      optimizeImages,
      copyImages,
    )
  ).on('change', browserSyncReload);

  gulp.watch(
    [
      ...watchingGlobs.sprite,
    ],
    mergeSvg(),
  ).on('change', browserSyncReload);
};

function defaultTask(cb) {
  const defaultMsg = '\n~ available commands:\n# dev\n\n';

  console.log(defaultMsg);
  cb();
}

exports.default = defaultTask;

exports.deploy = runDeploy;
exports.prettifyTemplates = prettifyTemplates;
exports.transformFonts = transformFonts();
exports.copyFonts = copyFonts;
exports.optimizeImages = optimizeImages;
exports.copyImages = copyImages;
exports.mergeSvg = mergeSvg();

exports.compileModules = compileModules;
exports.compileTemplates = compileTemplates;

exports.start = gulp.series(
  cleanPublic,
  compileModules,
  compileTemplates,
  optimizeImages,
  copyImages,
  mergeSvg(),
  upServer,
  watchFiles,
);

exports.build = gulp.series(
  setProductionEnv,
  cleanPublic,
  compileModules,
  compileTemplates,
  prettifyTemplates,
  optimizeImages,
  copyImages,
  mergeSvg(),
);