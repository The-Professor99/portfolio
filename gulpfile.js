const gulp = require("gulp"),
  panini = require("panini"),
  scss = require("gulp-sass"),
  cssmini = require("gulp-uglifycss"),
  cssprefix = require("gulp-autoprefixer"),
  jsmini = require("gulp-terser"),
  srcmaps = require("gulp-sourcemaps"),
  imgmin = require("gulp-imagemin"),
  hash = require('gulp-hash'),
  replace = require('gulp-replace'),
  browserSync = require("browser-sync").create();

const paths = {
  panini: {
    src: "./src/pages/**/*.html",
    root: "./src/pages",
    layouts: "./src/layouts",
    partials: "./src/partials",
    helpers: "./src/helpers",
    data: "./src/data",
    dest: "./public",
  },
  scss: {
    src: "./src/lib/scss/**/*.scss",
    map: "../sourcmaps/css",
    dest: "./public/css",
  },
  js: {
    src: "./src/lib/js/**/*.js",
    map: "../sourcmaps/js",
    dest: "./public/js",
  },
  images: {
    src: [
      "./src/lib/images/**/*.ico",
      "./src/lib/images/**/*.svg",
      "./src/lib/images/**/*.png",
      "./src/lib/images/**/*.jpg",
    ],
    dest: "./public/images",
  },
  files: {
    src: "./src/lib/files/*.pdf",
    dest: "./public/files",
  },
  tmp: {
    dest: "./public/tmp",
  },
  app: {
    html: './public/*.html'
  },
};

/**
 *
 * Compile html src files to normal html
 *
 * Compile `scss` to `css`, autoprefix,
 * and minify
 *
 * Compile all `es6 js`, to `es2015` and minify
 *
 * Minify images
 *
 */
function pages() {
  return gulp
    .src(paths.panini.src) 
    .pipe(
      panini({
        root: paths.panini.root,
        layouts: paths.panini.layouts,
        partials: paths.panini.partials,
        helpers: paths.panini.helpers,
        data: paths.panini.data,
      })
    )   
    .pipe(gulp.dest(paths.panini.dest))
    .pipe(browserSync.stream());
}
exports.pages = pages;

function style() {
  return gulp
    .src(paths.scss.src)
    .pipe(hash())
    .pipe(srcmaps.init())
    .pipe(scss())
    .pipe(cssprefix("last 2 versions"))
    .pipe(cssmini())
    .pipe(srcmaps.write(paths.scss.map))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(hash.manifest('cssassets.json')) 
    .pipe(gulp.dest(paths.tmp.dest))
    .pipe(browserSync.stream());
}
exports.style = style;

function js() {
  return gulp
    .src(paths.js.src)
    .pipe(hash())
    .pipe(srcmaps.init())
    .pipe(jsmini())
    .pipe(srcmaps.write(paths.js.map))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(hash.manifest('jsassets.json')) 
    .pipe(gulp.dest(paths.tmp.dest))
    .pipe(browserSync.stream());
}
exports.js = js;

function hashifyJSCSS() {
  var assets = require('./public/tmp/jsassets.json');
  var cssassets = require('./public/tmp/cssassets.json');
  return gulp
    .src(paths.app.html)
    .pipe(replace('style.css', cssassets['style.scss']))
    .pipe(replace('main.js', assets['main.js']))
    .pipe(replace('app.js', assets['app.js']))
    .pipe(replace('modules/ui.js', assets['modules/ui.js']))
    .pipe(replace('analytics.js', assets['analytics.js']))
    .pipe(gulp.dest(paths.panini.dest));
    
}
exports.hashify = hashifyJSCSS


function hashifyJSCSS2() {
  var assets = require('./public/tmp/jsassets.json');
  var cssassets = require('./public/tmp/cssassets.json');
  return gulp
    .src('./public/**/*.js')
    .pipe(replace('style.css', cssassets['style.scss']))
    .pipe(replace('main.js', assets['main.js']))
    .pipe(replace('app.js', assets['app.js']))
    .pipe(replace('modules/ui.js', assets['modules/ui.js']))
    .pipe(replace('analytics.js', assets['analytics.js']))
    .pipe(gulp.dest('./public/'));
    
}
exports.hashify2 = hashifyJSCSS2

function imageMin() {
  return gulp
    .src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}
exports.minimage = imageMin;

function fileMin() {
  return gulp
    .src(paths.files.src)
    .pipe(gulp.dest(paths.files.dest));
}
exports.minifile = fileMin;

const refreshPages = gulp.series((cb) => {
  panini.refresh(true);
  cb();
}, pages);
exports.refreshPages = refreshPages;

const sync = (cb) => {
  browserSync.init({
    server: {
      baseDir: "./public",
    },
  });

  cb();
};
exports.sync = sync;

const watch = gulp.series(sync, (cb) => {
  gulp.watch(
    [
      `${paths.panini.data}/**/*`,
      `${paths.panini.helpers}/**/*`,
      `${paths.panini.layouts}/**/*`,
      `${paths.panini.root}/**/*`,
      `${paths.panini.partials}/**/*`,
    ],
    refreshPages
  );
  gulp.watch(paths.scss.src, style);
  gulp.watch(paths.js.src, js);
  gulp.watch(paths.images.src, imageMin);

  cb();
});
exports.watch = watch;
