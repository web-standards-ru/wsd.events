var gulp = require('gulp');

// Watching for changes
// and running tasks

gulp.task('watch', function () {
	gulp.watch('src/assets/**', ['copy']);
	gulp.watch('src/pages/**/*.html', ['html']);
	gulp.watch('src/styles/**/*.scss', ['styles']);
	gulp.watch('src/scripts/*.js', ['scripts']);
});
