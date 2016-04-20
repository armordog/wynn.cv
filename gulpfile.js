/* config */
var BUILD_LOCATION = "build";
var LOCALS_PATH = __dirname + '/src/wynn.slater.json';

/* dependencies */
var gulp = require('gulp'),
	openUrl = require("open"),
	livereload = require("gulp-livereload"),
	jade = require('pug'),
	fs = require("fs"),
	mkdirp = require("mkdirp"),
	del = require("del"),
	runSequence = require("run-sequence"),
	server = require("./server.js");


/* develop */

gulp.task('develop', function (done) {
	runSequence('build:all', 'serve', 'watch:all', done);
});

gulp.task('serve', function (done) {
	var listener = server.serve();
	var port = listener.address().port;
	openUrl("http://localhost:" + port);
	done();
});


/* build */

gulp.task('build:all', function (done) {
	runSequence('clean', 'build:copy', 'build:src', done);
});

gulp.task('build:copy', ['copy:src', 'copy:vendor']);

gulp.task('build:src', ['build:jade']);

gulp.task('build:jade', function (done) {
	delete require.cache[require.resolve(LOCALS_PATH)];
	var json = require(LOCALS_PATH);

	var html = jade.renderFile(__dirname + '/src/templates/index.jade', json);
	fs.writeFile(BUILD_LOCATION + "/index.html", html, done);
});

gulp.task('copy:src', function (done) {
	return gulp.src(
		[
			'src/scripts/**/*',
			'src/styles/**/*',
			'!*.less'
		],
		{
			base:"src"
		}
	).pipe(gulp.dest(BUILD_LOCATION));
});

gulp.task('copy:vendor', function (done) {
	return gulp.src(
		[
			'node_modules/angular/angular.min.js',
			'node_modules/zepto/zepto.min.js',
			'node_modules/html5shiv/dist/html5shiv.min.js'
		]
	).pipe(gulp.dest(BUILD_LOCATION + "/vendor"));
});

gulp.task('clean', function () {
	return del([
		BUILD_LOCATION + "/**/*"
	]);
});





/* watch */
gulp.task('watch:all', ["watch:jade", "watch:resource", "watch:static"]);

gulp.task('watch:jade', function () {
	gulp.watch(
		['src/templates/**/*'],
		['build:jade']
	);
});

gulp.task('watch:resource', function () {
	gulp.watch(
		[
			'src/scripts/**/*',
			'src/styles/**/*'
		],
		['copy:src']
	);
});

gulp.task('watch:static', function () {
	livereload.listen();
	gulp.watch(
		[
			"build/**/*"
		],
		function () {
			livereload.reload();
		}
	);
});

gulp.task('default', ['develop']);

gulp.task('run', ['server']);