var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	sync = require('browser-sync').get('sync');

gulp.task('scripts', function () {
	return gulp.src('src/scripts/script.js')
		.pipe(uglify())
		.pipe(gulp.dest('dest/scripts'))
		.pipe(sync.stream());
});
