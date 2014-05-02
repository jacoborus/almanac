
var gulp = require('gulp'),
	cssmin = require('gulp-cssmin'),
	rename = require("gulp-rename"),
	hogan = require('gulp-hogan');

gulp.task('csso', function () {
    gulp.src('devFixtures/raw.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('hogan', function(){
  gulp.src('almanac.js')
    .pipe(hogan({inject: 'gnumanth'}))
    .pipe(gulp.dest('dist'));
});