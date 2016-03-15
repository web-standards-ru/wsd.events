const gulp = require('gulp');
const sequence = require('run-sequence').use(gulp);

// Building the site by running
// a sequence of other tasks

gulp.task('build:dev', [
	'copy',
	'html',
	'styles',
	'scripts'
]);

gulp.task('build:prod', (callback) => {
	sequence(
		'clean', 'build:dev', 'cache:hash', 'cache:replace', callback
	);
});
