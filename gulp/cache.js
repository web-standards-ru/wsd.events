const del = require('del');
const gulp = require('gulp');
const paths = require('vinyl-paths');
const replace = require('gulp-rev-replace');
const rev = require('gulp-rev');
const sequence = require('run-sequence').use(gulp);

gulp.task('cache:hash', () => {
	return gulp.src([
			'dest/styles/*.css',
			'dest/scripts/*.js'
		], {
			base: 'dest'
		})
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

gulp.task('cache', (callback) => {
	sequence('cache:hash', 'cache:replace', callback);
});
