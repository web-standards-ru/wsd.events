var autoprefixer = require('gulp-autoprefixer'),
	beml = require('gulp-beml'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-minify-css'),
	gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sync = require('browser-sync').create();

var paths = {
	html: 'src/**/*.html',
	styles: 'src/styles/*.scss'
};

gulp.task('default', [
	'build',
	'server',
	'watch'
]);

gulp.task('build', [
	'copy',
	'html',
	'styles'
]);

gulp.task('server', function () {
	sync.init({
		notify: false,
		server: {
			baseDir: 'dest/'
		}
	});
});

gulp.task('watch', function () {
	gulp.watch([
		'src/**',
		'!' + paths.html,
		'!' + paths.styles
	], ['copy']);

	gulp.watch(paths.html, ['html']);
	gulp.watch(paths.styles, ['styles']);
});

gulp.task('copy', function () {
	gulp.src([
			'src/**',
			'!' + paths.html,
			'!' + paths.styles,
			'!src/events{,/**}'
		])
		.pipe(gulp.dest('dest/'))
		.pipe(sync.stream());
});

gulp.task('html', function () {
	gulp.src(paths.html)
		.pipe(beml({
			elemPrefix: '__',
			modPrefix: '--' }))
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}))
		.pipe(rename(function (path) {
			var regex = /(\d{4})-(\d{2})-(\d{2})-\w+/;
			if (regex.test(path.basename)) {
				path.dirname = path.basename.replace(regex, '$1/$2/$3');
				path.basename = 'index';
			}
		}))
		.pipe(gulp.dest('dest/'))
		.pipe(sync.stream());
});

gulp.task('styles', function () {
	gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssmin())
		.pipe(gulp.dest('dest/styles/'))
		.pipe(sync.stream());

	gulp.src('src/styles/ubuntu-*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(cssmin())
		.pipe(concat('ubuntu.css'))
		.pipe(gulp.dest('dest/styles/'))
		.pipe(sync.stream());
});
