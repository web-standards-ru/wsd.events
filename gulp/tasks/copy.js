var gulp = require('gulp'),
	config = require('../config'),
	sync = require('browser-sync').get('sync');

// Copying all assets
// to the dest folder

gulp.task('copy', function () {
	return gulp.src(config.src.assets)
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream({once:true}));
});
