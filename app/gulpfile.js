var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');

var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');

var babel = require('gulp-babel'); //nie zainstaloway
/*-------------------------------------------------------*/
var config = {
    dist: 'dist/',
    app: 'app/',
    cssin: 'app/css/**/*.css',
    jsin: 'app/js/**/*.js',
    imgin: 'app/images/**/*.{jpg,jpeg,png,gif}',
    htmlin: 'app/*.html',
    scssin: 'app/scss/**/*.scss',
    cssout: 'dist/css/',
    jsout: 'dist/js/',
    imgout: 'dist/images/',
    htmlout: 'dist/',
    scssout: 'app/css/',
    cssoutname: 'style-min.css',
    jsoutname: 'script-min.js',
    cssreplaceout: 'css/style-min.css',
    jsreplaceout: 'js/script-min.js'
};

/*--------------------------------------------------------*/
gulp.task('reload', function() {
    browserSync.reload();
});


/*odpalenie gulpa*/
gulp.task('serve', ['sass'], function() {

    browserSync({
        server: config.app
    });
});


/*-----------------------------------------------------------------*/
gulp.watch(config.htmlin,['reload']);
gulp.watch(config.scssin, ['sass']);


/*gulp kompilujacy pliki scss na css*/

gulp.task("sass", function() {
    return gulp.src(config.scssin)
        .pipe(sourcemaps.init()) /*gulp sourcemap*/
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        // outputStyle: 'expanded',  rodzaj formatowania css
        // sourceComments: 'map'    czy wypisywac zrodla do scss
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write()) /*gulp sourcemap*/
        .pipe(gulp.dest(config.scssout))
        .pipe(browserSync.stream());

});
//minifikacja html------------------------------
gulp.task('html', function() {
    return gulp.src(config.htmlin)
        .pipe(htmlReplace({
            'css': config.cssreplaceout,
            'js': config.jsreplaceout
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            // collapseWhitespace: true
        }))
        .pipe(gulp.dest(config.dist));
});

// minifikacja CSS--------------------------------------
gulp.task('css', function() {
    return gulp.src(config.cssin)
        .pipe(concat(config.cssoutname)) //nadanie nazwy pliku sconcatenowanu
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.cssout));
});

// babel i es6-----------------------------------------------
// gulp.task('babel', function(){
//   return gulp.src(config.jsin)
//   .pipe(concat(config.jsoutname))  //nadanie nazwy pliku sconcatenowanu
//   .pipe(uglify())
//   .pipe(gulp.dest(config.jsout));
// });
// minifikacja js ------------------------------------------

gulp.task('js', function() {
    return gulp.src(config.jsin)
        .pipe(concat(config.jsoutname)) //nadanie nazwy pliku sconcatenowanu
        // .pipe(uglify())
        .pipe(gulp.dest(config.jsout));
});

// minimalize images------------------------------------------

gulp.task('img', function() {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout));
});


// run delete ---------------------------

gulp.task('clean', function() {
    return del([config.dist]);
});
// run sequence---------------------------

gulp.task('build', function() {
    sequence('clean', ['css', 'js', 'html', 'img']);
});


gulp.task('default', ['serve'], function() {});