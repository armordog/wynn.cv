exports.serve = function () {

	var express = require('express'),
		connectLivereload = require("connect-livereload");

	var hostApp = express();

	hostApp.use(connectLivereload());
	hostApp.use(express.static(__dirname + '/build'));

	var listener = hostApp.listen(9000, function () {
		var port = listener.address().port;
		console.log("listening on port ", port);
	});

	return listener;

};