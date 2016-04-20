(function () {

var app = angular.module("wynn", []);

app.controller("outlineController", ["$scope", "$window",
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

app.directive("outline", [
	function () {
		return {
			apply: "A",
			require: {
				parentController: "?^^outline",
				ownController: "outline"
			},
			scope: {
				outline: "=?outline"
			},
			controller: ["$scope", "$attrs", function ($scope, $attrs) {

				var module = {
					id: undefined,
					label: "",
					children: [],
					init: init,
					registerChild: registerChild
				};

				function init (cfg) {
					module.id = cfg.id;
					module.label = cfg.label;
				}

				function registerChild (ctrl) {
					module.children.push(ctrl);
					if ($attrs.outline) {
						$scope.outline = module.children;
					}
				}

				return module;
			}],
			link: function (scope, el, attrs, ctrls) {
				ctrls.ownController.init({
					id: el.attr("id"),
					// label: el.text()
					label: el.attr("id")
				});
				if(ctrls.parentController) {
					ctrls.parentController.registerChild(ctrls.ownController);
				}
			}
		};
	}
]);








})();