const gulp = require('gulp');
const connect = require('gulp-connect');

gulp.task('connect', () => {
    connect.server({
        root: './',
        livereload: true,
    });
});

gulp.task('html', () => {
    gulp.src('./*.html')
    .pipe(gulp.dest('./'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./*.html'], ['html']);
  });

gulp.task('default', ['connect', 'watch']);