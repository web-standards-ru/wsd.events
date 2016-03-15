const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sync = require('browser-sync').get('sync');

gulp.task('scripts', () => {
	return gulp.src('src/scripts/script.js')
		.pipe(uglify())
		.pipe(gulp.dest('dest/scripts'))
		.pipe(sync.stream());
});
