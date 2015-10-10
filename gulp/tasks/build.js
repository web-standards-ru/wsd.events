var gulp = require('gulp');

// Building the site by running
// a sequence of other tasks

gulp.task('build', [
	'copy',
	'html',
	'styles'
]);
