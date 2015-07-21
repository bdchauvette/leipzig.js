var gulp = require('gulp');
var babel = require('gulp-babel');
var csscomb = require('gulp-csscomb');
var csswring = require('csswring');
var postcss = require('gulp-postcss');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
  return gulp.src('src/*.js')
    .pipe(babel({ modules: 'umd', moduleId: 'Leipzig' }))
    .pipe(gulp.dest('./dist'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
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
