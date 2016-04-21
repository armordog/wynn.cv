(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = angular.module(
	'cv',
	[
		require('./services/localStorageJson').name
	]
).controller({
	cvController: function ($scope, localStorageJson) {
		$scope.model = {
			phone: localStorageJson.get("phone"),
			address: localStorageJson.get("address")
		};
	}
});
},{"./services/localStorageJson":2}],2:[function(require,module,exports){
module.exports = angular.module(
	'localStorageJson',
	[]
).service({
	localStorageJson: function ($window) {

		function getLocalStorage () {
			return $window.localStorage || {};
		}

		function get (key) {
			var json, raw = getLocalStorage()[key];

			try {
				json = JSON.parse(raw);
			} catch (e) {
				/* a rare instance where we really want to discard an error */
			}

			return json;
		}

		function put (key, value) {
			getLocalStorage()[key] = JSON.stringify(value);
		}

		return {
			get: get,
			put: put
		};

	}
});
},{}]},{},[1])