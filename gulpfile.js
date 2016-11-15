var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    typescript = require('typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    buffer = require('vinyl-buffer'),
    gulpbrowserify = require('gulp-browserify'),
    browserifyshim = require('browserify-shim');

var Config = require('./gulpfile.config');
var tsProject = ts.createProject('src/tsconfig.json', { typescript: typescript });
var config = new Config();

gulp.task("ts-compile", function name() {
    var result = gulp.src('src/**/*{ts,tsx}')
        .pipe(ts(tsProject));
    return result.js.pipe(gulp.dest('.tmp'));
});

gulp.task('default', ['ts-compile'], function () {
    return browserify({        
        entries: './.tmp/main.js',
    })
        .transform(browserifyshim)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist'))
        .pipe(buffer()) 
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())  
        .pipe(gulp.dest('dist'));
});

gulp.task('shim', function () {
    gulp.src('.tmp/main.js')
        .pipe(gulpbrowserify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function (done) {
    // del(['dist/**/*.*'], done.bind(this));
    del(['/.tmp/**/*.*'], done.bind(this));
});

gulp.task('watch', ['default'], function () {
  gulp.watch('src/**/*{ts,tsx}', ['default']);
});