var gulp = require('gulp');
var babel = require('gulp-babel');
var csscomb = require('gulp-csscomb');
var csswring = require('csswring');
var header = require('gulp-header');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
  var headerText = [
    '/*! leipzig.js v0.8.1',
    'ISC License',
    'github.com/bdchauvette/leipzig.js */'
  ].join(' | ');

  var babelConfig = {
    modules: 'umd',
    moduleId: 'Leipzig',
    plugins: ['object-assign']
  };

  return gulp.src('src/*.js')
    .pipe(babel(babelConfig))
    .pipe(header(headerText + '\n'))
    .pipe(gulp.dest('./dist'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify({ preserveComments: 'some' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('comb', function() {
  return gulp.src('src/*.scss')
    .pipe(csscomb())
    .pipe(gulp.dest('./src'));
});

gulp.task('css', function() {
  return gulp.src('src/*.scss')
    .pipe(csscomb())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('./dist'))
    .pipe(postcss([csswring]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['js', 'css'], function() {});

gulp.task('watch', function() {
  var jsWatcher = gulp.watch('src/*.js', ['js']);
  var styleWatcher = gulp.watch('src/*.scss', ['css']);
});

gulp.task('default', ['build']);
