const gulp = require('gulp');
const rsync = require('gulp-rsync');

gulp.task('deploy', () => {
	return gulp.src('dest/**')
		.pipe(rsync({
			root: 'dest',
			hostname: 'web-standards.ru',
			destination: '/var/www/wsd.events/html/',
			recursive: true,
			clean: true,
			incremental: true,
			exclude: '.DS_Store'
		}));
});
