var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	webserver = require('gulp-webserver'),
	autoprefixer = require('gulp-autoprefixer'),
	jade = require('gulp-jade'),
	jadeOrig = require('jade'),
	stylus = require('gulp-stylus'),
	concat = require('gulp-concat'),

	imagemin = require('gulp-imagemin'),
	uglify = require('gulp-uglify'), // минификатор
	csso = require('gulp-csso');

// Пути к файлам
path = {
	html: {
		source: ['./dev/**/*.jade', './dev/layouts/*.jade', './dev/layouts/**/*.jade'],
		watch: './dev/**/*.jade',
		destination: './public/',
		basedir: './dev'
	},
	css: {
		source: './dev/css/layout.styl',
		watch: './dev/**/*.styl',
		destination: './public/assets/css/',
		distribution: 'css.css',
		sourseMap: './dev/css'
	},
	img: {
		source: './dev/img/**/*.{jpg,jpeg,png,gif,svg}',
		watch: './dev/img/**/*',
		destination: './public/assets/img'
	},
	js: {
		source: './dev/js/**/*',
		watch: './dev/js/**/*',
		destination: './public/assets/js'
	},
	sprite: {
		source: './dev/img/sprite/*.png',
		icons: './dev/img/',
		style: './dev/css/',
		watch: './dev/img/sprite/*',

	}
};

// Локальный сервер
gulp.task('webserver', function() {
	gulp.src('public')
		.pipe(webserver({
			host: '192.168.0.15', // Если нужен сервер в сети ставьте 0.0.0.0 localhost
			// host: 'localhost', // Если нужен сервер в сети ставьте 0.0.0.0 localhost
			port: 3003,
			// livereload: true,
			// open: "/index.html"
		}));
});

// Собираем JS
gulp.task('js', function() {



	gulp.src([
			"./dev/js/lib/jquery/jquery.min.js",

			"./dev/js/helper-page.js",

			"./dev/js/lib/backbone/underscore.js",
			"./dev/js/lib/backbone/backbone.js",

			"./dev/js/lib/inputmask/inputmask.js", 

			"./dev/js/bbapp/init-helpers.js",

			"./dev/js/bbapp/routes/main-router.js",
			"./dev/js/bbapp/models/main-model.js",
			"./dev/js/bbapp/view/main-view.js",

			"./dev/js/bbapp/init-bbapp.js",
		])
		.pipe(concat('app.min.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('./public/assets/js'));

});



// --- Собираем Stylus ---//
// налик
gulp.task('stylus', function() {
	gulp.src(path.css.source)
		.pipe(stylus())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'ie 10', 'ie 11', 'ie 12', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat(path.css.distribution)) // file views
		.pipe(csso())
		.pipe(gulp.dest(path.css.destination)); // out place
});


// --- END Собираем Stylus ---//

// Собираем html из Jade
gulp.task('jade', function() {
	gulp.src(path.html.source)
		.pipe(jade({
			jade: jadeOrig,
			pretty: '\t',
			basedir: path.html.basedir,
			data: gulp.src(['users.json'])
		}))
		.pipe(gulp.dest(path.html.destination));
});


gulp.task('fonts', function() {
    // gulp.src(['./dev/fonts/**/*', './dev/fonts/*'])
    //     .pipe(gulp.dest('./public/assets/fonts'));
});

//Копируем изображения и сразу их обновляем
gulp.task('img', function() {
	gulp.src(path.img.source)
		.pipe(imagemin())
		.pipe(gulp.dest(path.img.destination));
});


// Watch Task
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(path.img.watch, ['img']).on('change', livereload.changed);
	gulp.watch(path.html.watch, ['jade']).on('change', livereload.changed);
	gulp.watch(path.js.watch, ['js']).on('change', livereload.changed);
	gulp.watch(path.css.watch, ['stylus']).on('change', livereload.changed);
});

gulp.task("build", [ 'img', 'jade', 'fonts', 'js', 'stylus', 'webserver']);
// Default Task
gulp.task("default", ['build', 'watch']);