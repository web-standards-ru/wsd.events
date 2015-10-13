var gulp = require('gulp'),
	open = require('open'),
	rsync = require('rsyncwrapper').rsync;

// Deploying all files
// from dest folder to server

gulp.task('deploy', function() {
	rsync({
		ssh: true,
		src: 'dest/**',
		dest: 'web-standards.ru:/var/www/wsd.events/www/htdocs/',
		args: [
			'--recursive', // recurse into directories
			'--checksum', // skip based on checksum, not mod-time & size
			'--chmod g+rw', // chmod new files
			'--compress', // compress data during the transfer
			'--times' // preserve modification times…
		]
	}, function (error) {
		if (error) {
			console.log(error);
		} else {
			open('http://wsd.events/');
		}
	});
});
