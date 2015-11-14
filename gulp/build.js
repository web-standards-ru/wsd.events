var gulp = require('gulp'),
	sequence = require('run-sequence').use(gulp);

// Building the site by running
// a sequence of other tasks

gulp.task('build:dev', [
	'copy',
	'html',
	'styles',
	'scripts'
]);

gulp.task('build:prod', function(callback) {
	sequence(
		'clean', 'build:dev', 'cache', callback
	);
});
