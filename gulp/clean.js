var gulp = require('gulp'),
	del = require('del');

// Cleaning up dest folder

gulp.task('clean', function() {
	return del('dest/**');
});
