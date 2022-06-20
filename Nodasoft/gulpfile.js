const { src, dest, series, watch } = require('gulp')

const concat = require('gulp-concat')

const htmlMin = require('gulp-htmlmin')

const autoprefixes = require('gulp-autoprefixer')

const cleanCSS = require('gulp-clean-css')

const browserSync = require('browser-sync').create()

const del = require('del')

const sourcemaps = require('gulp-sourcemaps')


const clean = () => {
    return del(['dist'])
}

const stylenormalize = () => {
    return src('src/stylenormalize/**')
        .pipe(dest('dist'))
}

const fonts = () => {
    return src('src/fonts/**')
        .pipe(dest('dist/fonts'))
}


const stylesDev = () => {
    return src('src/styles/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('main.css'))
        .pipe(autoprefixes({
            cascade: false,
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        // следит за изменением файлов
        .pipe(browserSync.stream())
}

const stylesProd = () => {
    return src('src/styles/**/*.css')
        .pipe(concat('main.css'))
        .pipe(autoprefixes({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('dist'))
        // следит за изменением файлов
        .pipe(browserSync.stream())
}

const htmlDev = () => {
    return src('src/**/*.html')
        .pipe(dest('dist'))
        // следит за изменением файлов
        .pipe(browserSync.stream())
}

const htmlProd = () => {
    return src('src/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(dest('dist'))
        // следит за изменением файлов
        .pipe(browserSync.stream())
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

watch('src/**/*.html', htmlDev)
watch('src/styles/**/*.css', htmlProd)
watch('src/**/*.html', stylesDev)
watch('src/styles/**/*.css', stylesProd)

exports.clean = clean
exports.build = series(clean, fonts, stylenormalize, htmlDev, stylesDev, watchFiles)
exports.production = series(clean, fonts, stylenormalize, htmlProd, stylesProd, watchFiles)
exports.default = series(clean, fonts, stylenormalize, htmlProd, stylesProd, watchFiles)