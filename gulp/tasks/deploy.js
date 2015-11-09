var gulp = require('gulp'),
	open = require('open'),
	rsync = require('gulp-rsync');

// Deploying all files
// from dest folder to server

gulp.task('deploy', function() {
	return gulp.src('dest/**')
		.pipe(rsync({
			root: 'dest',
			hostname: 'web-standards.ru',
			destination: '/var/www/wsd.events/www/htdocs/',
			recursive: true,
			clean: true,
			incremental: true
		}));
});
