const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const sync = require('browser-sync').get('sync');

gulp.task('styles', () => {
	// Building main styles into screen.css
	const screen = gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
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
