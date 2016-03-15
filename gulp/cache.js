const gulp = require('gulp');
const rev = require('gulp-rev');
const replace = require('gulp-rev-replace');
const paths = require('vinyl-paths');
const del = require('del');

gulp.task('cache:hash', () => {
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

gulp.task('cache:replace', () => {
	return gulp.src('dest/**/*.html')
		.pipe(replace({
			manifest: gulp.src('dest/rev-manifest.json').pipe(paths(del))
		}))
		.pipe(gulp.dest('dest'));
});
