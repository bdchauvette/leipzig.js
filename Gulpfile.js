var gulp = require('gulp');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('build', function() {
  return gulp.src('src/leipzig.js')
    .pipe(umd())
    .pipe(gulp.dest('./dist'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  var watcher = gulp.watch('src/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
