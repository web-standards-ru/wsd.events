const gulp = require('gulp');
const sequence = require('run-sequence').use(gulp);

gulp.task('build:dev', [
	'copy',
	'html',
	'styles',
	'scripts'
]);

gulp.task('build:prod', (callback) => {
	sequence(
		'clean', 'build:dev', 'cache', 'images', callback
	);
});
