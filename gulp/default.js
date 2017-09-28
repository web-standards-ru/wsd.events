const gulp = require('gulp');

gulp.task('default', [
	'build:dev',
	'server',
	'watch'
]);
