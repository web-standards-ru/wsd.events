const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const gulp = require('gulp');
const svg = require('postcss-inline-svg');
const merge = require('merge-stream');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sync = require('browser-sync').get('sync');

gulp.task('styles', () => {
	// Building main styles into screen.css
	const screen = gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			autoprefixer,
			svg
		]))
		.pipe(csso())
		.pipe(gulp.dest('dest/styles'))
		.pipe(sync.stream());

	// Building all non-regular font faces into ubuntu.css
	const fonts = gulp.src('src/styles/blocks/ubuntu/!(regular).scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(csso())
		.pipe(concat('ubuntu.css'))
		.pipe(gulp.dest('dest/styles'))
		.pipe(sync.stream());

	return merge(screen, fonts);
});
