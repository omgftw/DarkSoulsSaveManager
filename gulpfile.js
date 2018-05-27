var childProcess = require('child_process');
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var path = require('path');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');

var projectDir = jetpack;
var srcDir = projectDir.cwd('.');
var buildDir = projectDir.cwd('./build');
var distDir = projectDir.cwd('./dist');

gulp.task('clean', function (callback) {
    return buildDir.dirAsync('.', { empty: true });
});

gulp.task('copy', ['clean'], function () {
    return projectDir.copyAsync('.', buildDir.path(), {
        overwrite: true, matching: [
            // './node_modules/**/*',
            '*.html',
            '*.css',
            'main.js',
            'package.json',
            '*.svg',
            'notify.mp3'
        ]
    });
});

gulp.task('build-app', ['copy'], function () {
    return gulp.src('./index.html')
        .pipe(usemin({
            js: [uglify()]
        }))
        .pipe(gulp.dest('build/'));
});


var release_windows = require('./build.windows');
var os = require('os');

gulp.task('build-electron', ['build-app'], function () {
    process.env.NODE_ENV = 'production';
    switch (os.platform()) {
        case 'darwin':
            // execute build.osx.js 
            break;
        case 'linux':
            //execute build.linux.js 
            break;
        case 'win32':
            return release_windows.build();
    }
});

gulp.task('rename-exe', ['build-electron'], function () {
    var src = path.join(distDir.path(), 'electron.exe');
    var dest = path.join(distDir.path(), 'DarkSoulsSaveManager.exe')
    return gulp.src(src)
        .pipe(clean())
        .pipe(rename(dest))
        .pipe(gulp.dest(distDir.path()))
        
});

gulp.task('build', ['rename-exe'])

//task alias
gulp.task('electron-build', ['build-electron'], function () { });