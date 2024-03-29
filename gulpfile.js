const { src, dest, watch, parallel, series } = require('gulp');
const sass                           = require('gulp-sass')(require('sass'));
const concat                         = require('gulp-concat');
const browserSync                    = require('browser-sync').create();
const uglify                         = require('gulp-uglify-es').default;
const autoprefixer                   = require('gulp-autoprefixer');
const imagemin                       = require('gulp-imagemin');
const del                            = require('del');

function browsersync() {
  browserSync.init({
    server : {
      baseDir: 'app'
    }
  });
}

function cleanDist() {
  return del('dist')
}

function images() {
  return src('app/assets/images/**/*')
    .pipe(imagemin(
      [
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevelL: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ]
    ))
    .pipe(dest('dist/assets/images'))
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'app/assets/js/main.js'
  ])

  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/assets/js'))
  .pipe(browserSync.stream())
}

function styles() {
  return src('app/sass/style.sass')

  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 version'],
    grid: true
  }))
  .pipe(dest('app/assets/css'))
  .pipe(browserSync.stream())
}

function build() {
  return src([
    'app/assets/css/style.min.css',
    'app/assets/fonts/**/*',
    'app/assets/js/main.min.js',
    'app/*.html'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

function watching() {
  watch(['app/sass/**/*.sass'], styles);
  watch(['app/assets/js/**/*.js', '!app/assets/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', browserSync.reload);
}


exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);