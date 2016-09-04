const gulp = require('gulp');
const beml = require('gulp-beml');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sync = require('browser-sync').get('sync');

gulp.task('html', () => {
	// Building all HTML pages
	return gulp.src('src/pages/**/*.html')
		// Applying BEML preprocessor
		.pipe(beml({
			elemPrefix: '__',
			modPrefix: '--' }))
		// Compressing HTML
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}))
		// Creating subfolders if date prefix detected
		// 3000-01-01-city.html becomes /3000/01/01/index.html
		.pipe(rename((path) => {
			const regex = /(\d{4})-(\d{2})-(\d{2})-\w+/;
			if (regex.test(path.basename)) {
				path.dirname = path.basename.replace(regex, '$1/$2/$3');
				path.basename = 'index';
			}
		}))
		// Writing all results to dest
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream({ once: true }));
});
