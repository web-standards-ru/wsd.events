const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const paths = require('vinyl-paths');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const revision = require('gulp-rev-replace');
const resize = require('gulp-responsive');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const svg = require('postcss-inline-svg');
const sync = require('browser-sync').create();
const uglify = require('gulp-uglify');

// HTML

gulp.task('html', () => {
	return gulp.src('src/pages/*.html', {
			ignore: 'src/pages/3000-01-01-city.html'
		})
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}))
		.pipe(rename((path) => {
			if (path.basename != 'index') {
				const events = /(\d{4})-(\d{2})-(\d{2})-\w+/;
				if (events.test(path.basename)) {
					path.dirname = path.basename.replace(events, '$1/$2/$3');
				} else {
					path.dirname = path.basename;
				}
				path.basename = 'index';
			}
		}))
		.pipe(gulp.dest('dist'))
		.pipe(sync.stream({ once: true }));
});

// Styles

gulp.task('styles', () => {
	return gulp.src('src/styles/screen.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([
			autoprefixer,
			svg
		]))
		.pipe(csso())
		.pipe(gulp.dest('dist/styles'))
		.pipe(sync.stream());
});

// Scripts

gulp.task('scripts', () => {
	return gulp.src('src/scripts/script.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'))
		.pipe(sync.stream());
});

// Images

gulp.task('images:resize', () => {
	return gulp.src('src/assets/speakers/*.jpeg')
		.pipe(resize({
			'*': [{
				width: 256, rename: { dirname: '256' }
			}, {
				width: 192, rename: { dirname: '192' }
			}, {
				width: 128, rename: { dirname: '128' }
			}]
		}, {
			quality: 70,
			silent: true,
			errorOnEnlargement: false
		}))
		.pipe(gulp.dest('dist/speakers'));
});

gulp.task('images:replace', () => {
	return gulp.src('dist/**/index.html')
		.pipe(replace(
			/<img class="speakers__picture" (src|data-src)="\/speakers\/([^"]+)" alt="([^"]+)">/g,
			'<img class="speakers__picture" $1="/speakers/128/$2" $1set="/speakers/256/$2 2x" alt="$3">'
		))
		.pipe(replace(
			/<img class="card__picture" src="\/speakers\/([^"]+)" alt="([^"]+)">/g,
			'<img class="card__picture" src="/speakers/192/$1" srcset="/speakers/256/$1 2x" alt="$2">'
		))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', gulp.parallel(
	'images:resize',
	'images:replace'
));

// Cache

gulp.task('cache:hash', () => {
	return gulp.src([
			'dist/styles/*.css',
			'dist/scripts/*.js'
		], {
			base: 'dist'
		})
		.pipe(paths(del))
		.pipe(rev())
		.pipe(gulp.dest('dist'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('dist'));
});

gulp.task('cache:replace', () => {
	return gulp.src('dist/**/*.html')
		.pipe(revision({
			manifest: gulp.src('dist/rev-manifest.json').pipe(paths(del))
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('cache', gulp.series(
    'cache:hash',
    'cache:replace'
));

// Clean

gulp.task('clean', () => {
	return del('dist/**');
});

// Copy

gulp.task('copy', () => {
	return gulp.src('src/assets/**')
		.pipe(gulp.dest('dist'))
		.pipe(sync.stream({
			once: true
		}));
});

// Server

gulp.task('server', () => {
	sync.init({
		ui: false,
		notify: false,
		server: {
			baseDir: 'dist'
		}
	});
	gulp.watch('index.html').on('change', () => {
        sync.reload();
    });
});

// Watch

gulp.task('watch', () => {
	gulp.watch('src/assets/**', gulp.parallel('copy'));
	gulp.watch('src/pages/**/*.html', gulp.parallel('html'));
	gulp.watch('src/styles/**/*.scss', gulp.parallel('styles'));
	gulp.watch('src/scripts/*.js', gulp.parallel('scripts'));
});

// Build

gulp.task('build:dev', gulp.series(
	'copy',
	'html',
	'styles',
	'scripts'
));

gulp.task('build:prod', gulp.series(
    'clean',
    'build:dev',
    'cache',
    'images'
));

// Default

gulp.task('default', gulp.parallel(
	'build:dev',
	'server',
	'watch',
	function(done) {
		done();
	}
));
