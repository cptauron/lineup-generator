(function () {
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	.value('version', '0.1')
	.factory('myService', function(){

		var stacks = [];

		var property = {
			"qbs":[{position: "QB", name: "Aaron Rodgers", salary: 9000, game: "GB@NO", projection: "21.4"}],
			"rbs":[{position: "RB", name: "Matt Forte", salary: 8800, game: "CHI@NE", projection: "23.5"}],
			"wrs":[{position: "WR", name: "Robert Woods", salary: 3000, game: "BUF@NY", projection: "36.7"}],
			"tes":[{position: "TE", name: "Zach Ertz", salary: 3200, game: "PHI@ARI", projection: "10.2"}],
			"defense":[{position: "D", name: "Brows", salary: 2700, game: "OAK@CLE", projection: "10.9"}]
		};

		//lineup format: { rb1: {rb obj}. rb2: {rb obj}, wr1: {wr obj}, wr2: {wr obj}, wr3: {wr obj}, te: {te obj}, def: {def obj}, rbPool: {eligible rbs}, wrPool: {eligible wrs}, tePool: {eligible tes}, defPool: {eligible defense} }
		var lineups = [];

		return {
			getLineups: function() {
				return lineups;
			},
			getRBPool: function(index) {
				return lineup[index].rbPool;
			},
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
			getPlayerSlot: function(slot) {
				return property[slot];
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