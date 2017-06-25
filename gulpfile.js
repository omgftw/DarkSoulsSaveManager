var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');

var projectDir = jetpack;
var srcDir = projectDir.cwd('.');
var destDir = projectDir.cwd('./build');

gulp.task('clean', function (callback) {
    return destDir.dirAsync('.', { empty: true });
});

gulp.task('copy', ['clean'], function () {
    return projectDir.copyAsync('.', destDir.path(), {
        overwrite: true, matching: [
            // './node_modules/**/*',
            '*.html',
            '*.css',
            'main.js',
            'package.json',
            '*.svg'
        ]
    });
});

gulp.task('build', ['copy'], function () {
    return gulp.src('./index.html')
        .pipe(usemin({
            js: [uglify()]
        }))
        .pipe(gulp.dest('build/'));
});


var release_windows = require('./build.windows');
var os = require('os');

gulp.task('build-electron', ['build'], function () {
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

//task alias
gulp.task('electron-build', ['build-electron'], function() {});