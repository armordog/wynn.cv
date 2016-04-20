exports.serve = function (webroot) {

	var express = require('express'),
		connectLivereload = require("connect-livereload");

	var hostApp = express();

	hostApp.use(connectLivereload());
	hostApp.use(express.static(webroot));

	var listener = hostApp.listen(9000, function () {
		var port = listener.address().port;
		console.log("listening on port ", port);
	});

	return listener;

};