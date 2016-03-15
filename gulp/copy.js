const gulp = require('gulp');
const sync = require('browser-sync').get('sync');

// Copying all assets
// to the dest folder

gulp.task('copy', () => {
	return gulp.src('src/assets/**')
		.pipe(gulp.dest('dest'))
		.pipe(sync.stream({
			once:true
		}));
});
