(function () {

	var app = angular.module("wynn", []);

	app.controller("cvController", ["$scope", "$window",
		function ($scope, $window) {
			var model = {
				menu:false
			};

			var localStorage = $window.localStorage;
			if (localStorage) {
				model.address = getAddress();
				model.phone = localStorage.phone;
			}

			$scope.model = model;

			function getAddress () {
				var address = localStorage.address;
				if (!address) {
					return false;
				}
				try {
					address = JSON.parse(address);
				} catch (e) {
					/* if it's not valid, it's not valid */
				}
				return address;
			}
		}
	]);

})();