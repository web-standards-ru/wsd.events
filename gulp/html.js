const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sync = require('browser-sync').get('sync');

gulp.task('html', () => {
	return gulp.src('src/pages/*.html')
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}))
		.pipe(rename((path) => {
			if (path.basename != 'index') {
				const events = /(\d{4})-(\d{2})-(\d{2})-\w+/;
				if (events.test(path.basename)) {
					path.dirname = path.basename.replace(events, '$1/$2/$3');
				} else {
					path.dirname = path.basename;
				}
				path.basename = 'index';
			}
		}))
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream({ once: true }));
});
