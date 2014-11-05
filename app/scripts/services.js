(function () {
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	.value('version', '0.1')
	.factory('myService', function(){

		var stacks = [{qb:"", o:""}];

		var property = {
			"qbs":[{position: "QB", name: "", salary: "", game: "", projection: ""}],
			"rbs":[{position: "RB", name: "", salary: "", game: "", projection: ""}],
			"wrs":[{position: "WR", name: "", salary: "", game: "", projection: ""}],
			"tes":[{position: "TE", name: "", salary: "", game: "", projection: ""}],
			"defense":[{position: "D", name: "", salary: "", game: "", projection: ""}]
		};

		return {
			getPlayers: function() {
				return property;
			},
			setPlayers: function (value) {
				property = value;
			},
			getGames: function() {
				var games = [];
				var temp = [property.qbs, property.rbs, property.wrs, property.tes, property.defense];
				temp.forEach(function(value, index){
					value.forEach(function(value, index){
						if(typeof value.game != 'undefined') {
							games.push(value.game);
						}
					});
				});

				var uniq = games.slice()
					.sort(function(a,b){
						return a - b;
					})
					.reduce(function(a,b){
						if (a.slice(-1)[0] !== b) a.push(b);
						return a;
					},[]);

				return uniq;
			},
			getQbs: function() {
				return property.qbs;
			},
			getOffense: function() {
				return property.wrs.concat(property.rbs.concat(property.tes));
			},
			setStacks: function(stack) {
				stack.push(stack);
			},
			getStacks: function() {
				return stacks;
			}
		};
	});
})();