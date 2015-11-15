var gulp = require('gulp'),
	rev = require('gulp-rev'),
	replace = require('gulp-rev-replace'),
	paths = require('vinyl-paths'),
	del = require('del');

gulp.task('cache:hash', function() {
	return gulp.src([
			'dest/styles/*.css',
			'dest/scripts/*.js'
		], {base: 'dest'})
		.pipe(paths(del))
		.pipe(rev())
		.pipe(gulp.dest('dest'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dest'));
});

gulp.task('cache:replace', function() {
	return gulp.src('dest/**/*.html')
		.pipe(replace({
			manifest: gulp.src('dest/rev-manifest.json')
		}))
		.pipe(gulp.dest('dest'));
});
