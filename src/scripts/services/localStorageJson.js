module.exports = angular.module(
	'localStorageJson',
	[]
).service({
	localStorageJson: /*@ngInject*/ function ($window) {
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