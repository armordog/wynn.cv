'use strict';

module.exports = angular.module(
	'cv',
	[
		require('./services/localStorageJson').name
	]
).controller({
	cvController: /*@ngInject*/ function ($scope, localStorageJson) {
		$scope.model = {
			phone: localStorageJson.get("phone"),
			address: localStorageJson.get("address")
		};
	}
});