const { src, dest, series, parallel, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const inject = require('gulp-inject');
const del = require('del');
const es = require('event-stream');

function clear() {
  return del(['dist/**']);
}

function streamJsTask() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/'));
}

function streamCssTask() {
  return src('themes/*.css')
    .pipe(cleanCSS())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist/'));
}

function streamJsExampleTask() {
  return src('example/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/'));
}

function injectTask() {
  return src('example/*.html')
    .pipe(
      inject(
        es.merge(streamCssTask(), streamJsExampleTask(), streamJsTask()),
        {
          relative: true
        }
      )
    )
    .pipe(dest('dist/'));
}

exports.default = series(
  clear,
  parallel(streamCssTask, streamJsTask, injectTask)
);

exports.watch = function () {
  watch('themes/*.css', series(clear, streamCssTask, injectTask));
  watch('src/*.js', series(clear, streamJsTask, injectTask));
};
