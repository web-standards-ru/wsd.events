const gulp = require('gulp');
const resize = require('gulp-responsive');
const replace = require('gulp-replace');

gulp.task('images:resize', () => {
	return gulp.src('src/assets/speakers/*.jpg')
		.pipe(resize({
			'*': [{
				width: 256,
				rename: {
					dirname: '256'
				}
			}, {
				width: 192,
				rename: {
					dirname: '192'
				}
			}, {
				width: 128,
				rename: {
					dirname: '128'
				}
			}]
		}, {
			quality: 70,
			silent: true,
			errorOnEnlargement: false
		}))
		.pipe(gulp.dest('dest/speakers'));
});

gulp.task('images:replace', () => {
	return gulp.src('dest/**/*.html')
		.pipe(replace(
			/<img class="speakers__picture" src="\/speakers\/([a-z-.]+)" alt="([^".*]+)">/g,
			'<img class="speakers__picture" src="/speakers/128/$1" alt="$2">'
		))
		.pipe(replace(
			/<img class="card__picture" src="\/speakers\/([a-z-.]+)" alt="([^".*]+)">/g,
			'<img class="card__picture" src="/speakers/192/$1" srcset="/speakers/256/$1 2x" alt="$2">'
		))
		.pipe(gulp.dest('dest'));
});
