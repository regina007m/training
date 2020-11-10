// This ensures variables are declared
// before they can be used.
'use strict';

// Set variables for all node tools.
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();

// Creates standard paths for asset locations.
var paths = {
  css: {
    src: 'app/src/scss/*.scss',
    dest: 'app/dist/css'
  },
  js: {
    src: 'app/src/js/*.js',
    dest: 'app/dist/js'
  },
  html: {
    src: 'app/src/*.html',
    dest: 'app/dist'
  }
};

// Processes SCSS/CSS by adding sourcemaps, autoprefixer, and
// minifying.
function styles() {
  return gulp
    .src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream());
}

// Processes Javascript code.
function scripts() {
  return gulp
    .src(paths.js.src)
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// Processes html code.
function html() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Creates a watch task and reloads page with browserSync.
function watch() {
  browserSync.init({
    server: {
      baseDir: './app/dist'
    }
  });

  // BrowserSync reloads whenever css, javascript or html files are saved.
  gulp.watch(paths.css.src, styles);
  gulp.watch(paths.js.src, scripts);
  gulp.watch(paths.html.src, html).on('change', browserSync.reload);
}

// Exports tasks so they can be ran from CLI.
exports.watch = watch
exports.css = styles;
exports.scripts = scripts;

// Sets tasks to run in parallel.
var build = gulp.parallel(styles, scripts, html, watch);

// Creates default task.
gulp.task('default', build);
