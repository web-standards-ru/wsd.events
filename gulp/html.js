const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sync = require('browser-sync').get('sync');
const twig = require('gulp-twig');

gulp.task('html', () => {
	return gulp.src('src/pages/**/*.html')
		.pipe(twig())
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}))
		.pipe(rename((path) => {
			const regex = /(\d{4})-(\d{2})-(\d{2})-\w+/;
			if (regex.test(path.basename)) {
				path.dirname = path.basename.replace(regex, '$1/$2/$3');
				path.basename = 'index';
			}
		}))
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream({ once: true }));
});
