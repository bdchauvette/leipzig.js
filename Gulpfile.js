var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('build', function() {
  return gulp.src('src/leipzig.js')
    .pipe(babel({ modules: 'umd', moduleId: 'Leipzig' }))
    .pipe(gulp.dest('./dist'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  var watcher = gulp.watch('src/*.js', ['build']);
});

gulp.task('default', ['build', 'watch']);
