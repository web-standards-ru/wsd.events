const gulp = require('gulp');
const sync = require('browser-sync').get('sync');

// Starting up a server
// in the dest folder

gulp.task('server', () => {
	sync.init({
		ui: false,
		notify: false,
		server: {
			baseDir: 'dest'
		}
	});
});
