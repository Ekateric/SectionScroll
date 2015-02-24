var gulp = require('gulp'),
	less = require('gulp-less'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	cache = require('gulp-cache'),
	watch = require('gulp-watch');

var src = {
	css: 'src/css/style.less',
	js: ['src/js/vendor/jquery.mousewheel.min.js',
		'src/js/sectionScroll.js',
		'src/js/main.js']
};

//Compile Less
gulp.task('css', function () {
	return gulp.src(src.css)
		.pipe(less())
		.pipe(gulp.dest('css'));
});

//Minify Css
gulp.task('minCss', function () {
	return gulp.src('css/style.css')
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('css'));
});

//Concat js
gulp.task('js', function() {
	return gulp.src(src.js)
		.pipe(concat('main.js'))
		.pipe(gulp.dest('js'));
});

//Minify Js
gulp.task('minJs', function() {
	return gulp.src('js/main.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('js'));
});

//Minify Css & Js
gulp.task('minAll', function() {
	gulp.start('minCss', 'minJs');
});

// Clean destination folders
gulp.task('clean', function() {
	return gulp.src(['css', 'js'], {read: false})
		.pipe(clean());
});

//Watch
gulp.task('watch', function() {
	gulp.watch('src/css/**/*.less', ['css']);
	gulp.watch('src/js/**/*.js', ['js']);
});

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('css', 'js');
});