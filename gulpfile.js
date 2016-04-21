/* config */
var BUILD_LOCATION = ".build";
var LOCALS_PATH = __dirname + '/src/wynn.slater.json';

/* dependencies */
var gulp = require('gulp'),
	openUrl = require("open"),
	livereload = require("gulp-livereload"),
	jade = require('pug'),
	fs = require("fs"),
	streamify = require("gulp-streamify"),
	vss = require("vinyl-source-stream"),
	mkdirp = require("mkdirp"),
	del = require("del"),
	runSequence = require("run-sequence"),
	server = require("./server.js"),
	ghDeploy = require('gulp-gh-pages'),
	qrImage = require('qr-image'),
	browserify = require('gulp-browserify'),
	karmaServer = require('karma').Server;


/* develop */

gulp.task('develop', function (done) {
	runSequence('build:all', 'serve', 'watch:all', done);
});

gulp.task('serve', function (done) {
	var listener = server.serve(BUILD_LOCATION);
	var port = listener.address().port;
	openUrl("http://localhost:" + port);
	done();
});


/* build */

gulp.task('build:all', function (done) {
	mkdirp.sync(BUILD_LOCATION);
	runSequence('clean', ['build:copy', 'build:src'], done);
});

gulp.task('build:copy', ['copy:src', 'copy:vendor']);

gulp.task('build:src', ['build:jade', 'build:js', 'generate:image']);

gulp.task('generate:image', function () {
	mkdirp.sync(BUILD_LOCATION + "/images");
	var image = qrImage.image('http://armordog.github.io/wynn.cv/', {type:'svg'});
	var dest = fs.createWriteStream(BUILD_LOCATION + "/images/qr.svg");
	image.pipe(dest);
});

gulp.task('build:jade', function (done) {
	delete require.cache[require.resolve(LOCALS_PATH)];
	var json = require(LOCALS_PATH);

	var html = jade.renderFile(__dirname + '/src/templates/index.jade', json);
	fs.writeFile(BUILD_LOCATION + "/index.html", html, done);
});

gulp.task('build:js', function () {
	return gulp.src('src/scripts/app.js')
		.pipe(browserify())
		.pipe(gulp.dest(BUILD_LOCATION + "/scripts/"));
});

gulp.task('copy:src', function (done) {
	return gulp.src(
		[
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
gulp.task('watch:all', ["watch:jade", "watch:scripts", "watch:resource", "watch:static"]);

gulp.task('watch:jade', function () {
	gulp.watch(
		['src/templates/**/*'],
		['build:jade']
	);
});

gulp.task('watch:scripts', function () {
	gulp.watch(
		['src/scripts/**/*'],
		['build:js']
	);
});

gulp.task('watch:resource', function () {
	gulp.watch(
		[
			'src/styles/**/*'
		],
		['copy:src']
	);
});

gulp.task('watch:static', function () {
	livereload.listen();
	gulp.watch(
		[
			BUILD_LOCATION + "/**/*"
		],
		function () {
			livereload.reload();
		}
	);
});


/* test */
gulp.task('test', ['build:all'], runJasmineTests);

gulp.task('jasmine', runJasmineTests);

function runJasmineTests (done) {

	var server = new karmaServer({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	});

	server.on('run_complete', function (browsers, results) {
		done (results.error ? "Tests Failed" : null);
	});

	server.start();
}



/* deploy */
gulp.task('deploy', ['build:all'], function (done) {
	return gulp.src(BUILD_LOCATION + '/**/*')
		.pipe(ghDeploy());
});


gulp.task('default', ['develop']);