var gulp = require('gulp'),
	beml = require('gulp-beml'),
	htmlmin = require('gulp-htmlmin'),
	rename = require('gulp-rename'),
	sync = require('browser-sync').get('sync');

gulp.task('html', function () {
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
		.pipe(rename(function (path) {
			var regex = /(\d{4})-(\d{2})-(\d{2})-\w+/;
			if (regex.test(path.basename)) {
				path.dirname = path.basename.replace(regex, '$1/$2/$3');
				path.basename = 'index';
			}
		}))
		// Writing all results to dest
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream());
});
