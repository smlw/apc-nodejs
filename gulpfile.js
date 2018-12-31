'use strict';

const
        gulp         = require('gulp'),
		uglify       = require('gulp-uglify'),
        sass         = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        cssmin 		 = require('gulp-minify-css'),
        nodemon      = require('gulp-nodemon');

const route = {
    build: {
        js: 'public/javascripts/',
        css: 'public/stylesheets/',
    },
    src: { //Пути откуда брать исходники
        js: 'dev/js/**/*.js',
        css: 'dev/scss/**/*.scss'
    },
    watch: {
        js: 'dev/js/**/*.js',
        style: 'dev/scss/**/*.scss',
    }
};

gulp.task('style', () => {
    gulp.src(route.src.css)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(route.build.css));
});

gulp.task('js', () => {
    gulp.src(route.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(route.build.js));
});


gulp.task('build', [
    'js',
    'style'
]);


gulp.task('watch', () => {
    gulp.watch([route.watch.style], (event, cb) => {
        gulp.start('style');
    });
    gulp.watch([route.watch.js], (event, cb) => {
        gulp.start('js');
    });
});


gulp.task('nodemon', () => { nodemon({script: 'app.js'}) });

gulp.task('default', ['build', 'nodemon', 'watch']);