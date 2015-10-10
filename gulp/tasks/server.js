var gulp = require('gulp'),
	sync = require('browser-sync').create();

// Starting up a server
// in the dest folder

gulp.task('server', function () {
	sync.init({
		notify: false,
		server: {
			baseDir: 'dest'
		}
	});
});
