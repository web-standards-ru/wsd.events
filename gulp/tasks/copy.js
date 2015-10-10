var gulp = require('gulp'),
	config = require('../config'),
	sync = require('browser-sync').create();

// Copying all assets
// to the dest folder

gulp.task('copy', function () {
	gulp.src(config.src.assets)
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream());
});
