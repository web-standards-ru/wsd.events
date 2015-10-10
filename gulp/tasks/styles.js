var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssmin = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	sync = require('browser-sync').create();

gulp.task('styles', function () {
	// Building main styles into screen.css
	gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('dest/styles'))
		.pipe(sync.stream());

	// Building all non-regular font faces into ubuntu.css
	gulp.src(['src/styles/blocks/ubuntu/!(regular).scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(cssmin())
		.pipe(concat('ubuntu.css'))
		.pipe(gulp.dest('dest/styles'))
		.pipe(sync.stream());
});
