var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssmin = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	merge = require('merge-stream'),
	sync = require('browser-sync').get('sync');

gulp.task('styles', function () {
	// Building main styles into screen.css
	var screen = gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('dest/styles'))
		.pipe(sync.stream());

	// Building all non-regular font faces into ubuntu.css
	var fonts = gulp.src('src/styles/blocks/ubuntu/!(regular).scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(cssmin())
		.pipe(concat('ubuntu.css'))
		.pipe(gulp.dest('dest/styles'))
		.pipe(sync.stream());

	return merge(screen, fonts);
});
