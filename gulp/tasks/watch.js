var gulp = require('gulp'),
	config = require('../config');

// Watching for changes
// and running tasks

gulp.task('watch', function () {
	gulp.watch(config.src.assets, ['copy']);
	gulp.watch(config.src.html, ['html']);
	gulp.watch(config.src.styles, ['styles']);
	gulp.watch(config.src.scripts, ['scripts']);
});
