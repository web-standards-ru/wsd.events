const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const gulp = require('gulp');
const svg = require('postcss-inline-svg');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sync = require('browser-sync').get('sync');

gulp.task('styles', () => {
	return gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			autoprefixer,
			svg
		]))
		.pipe(csso())
		.pipe(gulp.dest('dest/styles'))
		.pipe(sync.stream());
});
