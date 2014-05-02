
var gulp = require('gulp'),
	cssmin = require('gulp-cssmin'),
	rename = require("gulp-rename"),
	hogan = require('gulp-hogan'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	uglify = require('gulp-uglify')
	clean = require('gulp-clean'),
	fs = require('fs');

gulp.task('csso', function (cb) {
	return gulp.src('devFixtures/raw.css')
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe( gulp.dest( 'dist' ));
});

gulp.task('hogan', function(){
	var CSSs = fs.readFileSync( 'dist/raw.min.css', 'utf8');
	console.log( CSSs );
	gulp.src('src/almanac.js')
		.pipe( hogan( {injectCSS: CSSs}))
		.pipe(gulp.dest('dist'));
});

// JS hint task
gulp.task('jshint', function() {
	gulp.src('./dist/almanac.js')
	.pipe( jshint() )
	.pipe( jshint.reporter( stylish ));
});


gulp.task( 'min', function () {
	// Single entry point to browserify
	gulp.src( './dist/almanac.js' )
	.pipe( uglify() )
	.pipe( rename( 'almanac.min.js' ))
	.pipe( gulp.dest( './dist' ));
});

gulp.task( 'clean', function () {
    gulp.src( 'dist/raw.min.css', {read: false})
        .pipe(clean());
});

// build
gulp.task( 'build', ['csso', 'hogan'] );

