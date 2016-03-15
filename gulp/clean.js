const gulp = require('gulp');
const del = require('del');

// Cleaning up dest folder

gulp.task('clean', () => {
	return del('dest/**');
});
