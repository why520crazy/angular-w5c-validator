const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpCopy = require('gulp-copy');
const header = require('gulp-header');
const less = require('gulp-less');
const package = require('./package.json');

gulp.task('concat', function () {
    return gulp.src(['./src/w5cValidator.js', './src/directive.js'])
        .pipe(concat('w5cValidator.js'))
        .pipe(header('/*! <%= pkg.name %> v<%= pkg.version %> <%= date %> */\n', {pkg: package, date: new Date()}))
        .pipe(gulp.dest('./'))
        .pipe(uglify({}))
        .pipe(concat('w5cValidator.min.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('less', function () {
    return gulp.src('./src/style.less')
        .pipe(less({
            // paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('copy', function () {
    return gulp
        .src('./src/style.less')
        .pipe(gulpCopy('./', {prefix: 1}));
});

gulp.task('example', function () {
    return gulp
        .src('./example/css/css.less')
        .pipe(less({
            // paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./example/css'));
});

gulp.task('default', ['copy', 'less', 'concat']);
gulp.task('build', ['default']);