/* config */
var BUILD_LOCATION = "./.build";
var LOCALS_PATH = __dirname + '/src/wynn.slater.json';

/* dependencies */
var gulp = require('gulp');
var openUrl = require("open");
var livereload = require("gulp-livereload");
var jade = require('pug');
var vss = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var del = require("del");
var runSequence = require("run-sequence");
var server = require("./server.js");
var ghDeploy = require('gulp-gh-pages');
var qrImage = require('qr-image');
var browserify = require('browserify');
var karmaServer = require('karma').Server;


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

gulp.task('build:all', ['clean'], function (done) {
	runSequence(['build:copy', 'build:src'], done);
});

gulp.task('build:copy', ['copy:src', 'copy:vendor']);

gulp.task('build:src', ['build:jade', 'build:js', 'generate:image']);

gulp.task('generate:image', function () {
	qrImage.image('http://armordog.github.io/wynn.cv/', {type:'svg'})
		.pipe(vss("qr.svg"))
		.pipe(gulp.dest(BUILD_LOCATION + "/images"));
});

gulp.task('build:jade', function () {
	delete require.cache[require.resolve(LOCALS_PATH)];
	var json = require(LOCALS_PATH);

	var html = jade.renderFile(__dirname + '/src/templates/index.jade', json);

	return stringToVinylStream(html, { path: "index.html"})
		.pipe(gulp.dest(BUILD_LOCATION));
});

function stringToVinylStream (string, options) {
	var File = require('vinyl');
	var Transform = require('stream').Transform;

	var vFile = new File({
		path: (options && options.path) || undefined,
		contents: new Buffer(string)
	});

	var stream = new Transform({
		objectMode: true
	});

	stream.push(vFile);
	stream.push(null);

	return stream;
}

gulp.task('build:js', bundleJs);

function bundleJs () {
	'use strict';

	return browserify(
		'./src/scripts/app.js',
		{
			insertGlobals: true
		}
	)
		.bundle()
		.pipe(vss('app.js'))
		.pipe(ngAnnotate())
		.pipe(buffer())
		.pipe(uglify({mangle:true}))
		.pipe(gulp.dest(BUILD_LOCATION + "/scripts"));
}

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