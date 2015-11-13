var gulp = require('gulp');

// Building the site and starting
// a server with a file watcher

gulp.task('default', [
	'build:dev',
	'server',
	'watch'
]);
