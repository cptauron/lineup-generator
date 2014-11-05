(function () {

'use strict';

/* Controllers */

angular.module('myApp.controllers', ["ui.select"])
  .controller('MyCtrl1', ['$scope', 'myService', '$sce', function($scope, myService, $sce) {

		$scope.trustAsHtml = function(value) {
			return $sce.trustAsHtml(value);
		};

		$scope.stacks = myService.getStacks();

		$scope.qbs = myService.getQbs();
		$scope.offense = myService.getOffense();

		$scope.addStack = function() {
			$scope.stacks.push({
				qb: "",
				o: ""
			});
		};

		$scope.stackCount = $scope.stackslength;

		console.log($scope.stacks);

  }])
  .controller('MyCtrl2', ['$scope', 'myService', function($scope, myService) {
		$scope.foo = myService.getPlayers();
		console.log($scope.foo);
		$scope.stacks = myService.getStacks();
		console.log($scope.stacks);
  }])
  .controller('MyCtrl3', ['$scope', 'myService', function($scope, myService) {

		var players = myService.getPlayers();

		$scope.games = myService.getGames();

		$scope.qbs = players.qbs;
		$scope.rbs = players.rbs;
		$scope.wrs = players.wrs;
		$scope.tes = players.tes;
		$scope.defense = players.defense;

		//$scope.qbs = [{position: "QB", name: "", salary: "", game: "", projection: ""}];
		//$scope.rbs = [{position: "RB", name: "", salary: "", game: "", projection: ""}];
		//$scope.wrs = [{position: "WR", name: "", salary: "", game: "", projection: ""}];
		//$scope.tes = [{position: "TE", name: "", salary: "", game: "", projection: ""}];
		//$scope.defense = [{position: "D", name: "", salary: "", game: "", projection: ""}];

		$scope.addQB = function() {
			$scope.qbs.push({
				name: "",
				position: "QB",
				game: "",
				projection: "",
				salary: ""
			});
			$scope.games = myService.getGames();
		};
		$scope.removeQB = function() {
			$scope.qbs.pop();
		};

		$scope.addWR = function() {
			$scope.wrs.push({
				name: "",
				position: "QB",
				game: "",
				projection: "",
				salary: ""
			});
			$scope.games = myService.getGames();
		};
		$scope.removeWR = function() {
			$scope.wrs.pop();
		};

		$scope.addRB = function() {
			$scope.rbs.push({
				name: "",
				position: "RB",
				game: "",
				projection: "",
				salary: ""
			});
			$scope.games = myService.getGames();
		};
		$scope.removeRB = function() {
			$scope.rbs.pop();
		};

		$scope.addTE = function() {
			$scope.tes.push({
				name: "",
				position: "TE",
				game: "",
				projection: "",
				salary: ""
			});
			$scope.games = myService.getGames();
		};
		$scope.removeTE = function() {
			$scope.tes.pop();
		};

		$scope.foo = myService.setPlayers({
			"qbs": $scope.qbs,
			"rbs": $scope.rbs,
		    "wrs": $scope.wrs,
			"tes": $scope.tes,
			"defense":$scope.defense
		});
  }]);
})();