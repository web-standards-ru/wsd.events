const gulp = require('gulp');
const sync = require('browser-sync').get('sync');

gulp.task('server', () => {
	sync.init({
		ui: false,
		notify: false,
		server: {
			baseDir: 'dest'
		}
	});
});
