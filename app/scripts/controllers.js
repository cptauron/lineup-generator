(function () {

    'use strict';

    /* Controllers */

    angular.module('myApp.controllers', ["ui.select"])
        .controller('MyCtrl1', ['$scope', 'myService', '$sce', function ($scope, myService, $sce) {

            $scope.trustAsHtml = function (value) {
                return $sce.trustAsHtml(value);
            };

            $scope.stacks = myService.getStacks();

            $scope.qbs = myService.getQbs();
            $scope.offense = myService.getOffense();

            $scope.selectedQB = "";
            $scope.selectedO = "";

            $scope.saveStack = function () {
                $scope.stacks.push({
                    qb: $scope.selectedQB,
                    o: $scope.selectedO,
                    generatedPicks: false
                });
            };

            $scope.updateSelectedQB = function (qb) {
                $scope.selectedQB = qb;
            };

            $scope.updateSelectedO = function (o) {
                $scope.selectedO = o;
            };

            $scope.stackCount = $scope.stackslength;

            console.log($scope.stacks);

        }])
        .controller('MyCtrl2', ['$scope', 'myService', '$sce', function ($scope, myService, $sce) {

            var salaryCap = 50000;

            $scope.trustAsHtml = function (value) {
                return $sce.trustAsHtml(value);
            };

            $scope.stacks = myService.getStacks();
            $scope.pickPool = myService.getPlayers();
            $scope.lineups = myService.getLineups();

            var lineupSchema = {
                chosenPlayers: {
                    qb: null,
                    flex: null,
                    rb1: null,
                    rb2: null,
                    wr1: null,
                    wr2: null,
                    wr3: null,
                    te: null,
                    def: null
                },
                pools: {
                    rbPool: myService.getPlayerSlot('rbs'),
                    wrPool: myService.getPlayerSlot('wrs'),
                    tePool: myService.getPlayerSlot('tes'),
                    defPool: myService.getPlayerSlot('defense')
                }
            };

            $scope.calculateEligibility = function (salaryCap, playerPools, chosenPlayers, index) {
                var salaries = {
                    qb: 0,
                    flex: 0,
                    rb1: 0,
                    rb2: 0,
                    wr1: 0,
                    wr2: 0,
                    wr3: 0,
                    te: 0,
                    def: 0
                };

                var currentSalary = 0;

                for (var key in chosenPlayers) {
                    if (chosenPlayers.hasOwnProperty(key)) {
                        var value = chosenPlayers[key];
                        if (value != null) {
                            if (isNaN(value.salary)) {
                                alert("Salary for " + value.position + " is not valid");
                            }
                            else {
                                salaries[key] = value.salary;
                                currentSalary = currentSalary + Number(value.salary);
                            }
                        }
                    }
                }
                console.log(salaries);
                console.log(currentSalary);
                $scope.updatePools(salaryCap, currentSalary, index);
            };

            $scope.updatePools = function(salaryCap, currentSalary, index) {
                //potential is $scope.pickPool
                var newPools = {
                    rbs: [],
                    wrs: [],
                    tes: [],
                    defense: []
                };

                var remainingSalary = salaryCap - currentSalary;
                console.log(remainingSalary);

                //reduce RB pool
                for (var i = 0, length = $scope.pickPool.rbs.length; i < length; i++) {
                    if($scope.pickPool.rbs[i].salary < remainingSalary) {
                        newPools.rbs.push($scope.pickPool.rbs[i]);
                    }
                }

                $scope.lineups[index].pools.rbPool = newPools.rbs;
                //reduce WR pool

                //reduce TE pool

                //reduce DEF pool

            };

            $scope.updateSelected = function(index, slot, data) {
                $scope.lineups[index].chosenPlayers[slot] = data;
                console.log($scope.lineups[index].chosenPlayers[slot]);
                $scope.calculateEligibility(salaryCap, null, $scope.lineups[index].chosenPlayers, index);
            };

            $scope.generatePicks = function (index) {
                $scope.stacks[index].generatedPicks = true;
                $scope.lineups[index] = lineupSchema;
                $scope.lineups[index].chosenPlayers.qb = $scope.stacks[index].qb;
                $scope.lineups[index].chosenPlayers.flex = $scope.stacks[index].o;

                $scope.calculateEligibility(salaryCap, null, $scope.lineups[index].chosenPlayers, index);

                console.log("Lineups:");
                console.log($scope.lineups);
            };
        }])
        .controller('MyCtrl3', ['$scope', 'myService', function ($scope, myService) {

            var players = myService.getPlayers();

            $scope.games = myService.getGames();

            $scope.qbs = players.qbs;
            $scope.rbs = players.rbs;
            $scope.wrs = players.wrs;
            $scope.tes = players.tes;
            $scope.defense = players.defense;

            $scope.populated = false;

            var testqbs = [
                {position: "QB", name: "QB1", salary: 5000, game: "Game1", projection: "NA"},
                {position: "QB", name: "QB2", salary: 5000, game: "Game2", projection: "NA"},
                {position: "QB", name: "QB3", salary: 5000, game: "Game3", projection: "NA"},
                {position: "QB", name: "QB4", salary: 5000, game: "Game4", projection: "NA"},
                {position: "QB", name: "QB5", salary: 5000, game: "Game5", projection: "NA"}
            ];

            var testrbs = [
                {position: "RB", name: "RB1", salary: 5000, game: "Game1", projection: "NA"},
                {position: "RB", name: "RB2", salary: 10000, game: "Game2", projection: "NA"},
                {position: "RB", name: "RB3", salary: 15000, game: "Game3", projection: "NA"},
                {position: "RB", name: "RB4", salary: 20000, game: "Game4", projection: "NA"},
                {position: "RB", name: "RB5", salary: 25000, game: "Game5", projection: "NA"}
            ];

            var testwrs = [
                {position: "WR", name: "WR1", salary: 5000, game: "Game1", projection: "NA"},
                {position: "WR", name: "WR2", salary: 10000, game: "Game2", projection: "NA"},
                {position: "WR", name: "WR3", salary: 15000, game: "Game3", projection: "NA"},
                {position: "WR", name: "WR4", salary: 20000, game: "Game4", projection: "NA"},
                {position: "WR", name: "WR5", salary: 25000, game: "Game5", projection: "NA"}
            ];

            var testtes = [
                {position: "TE", name: "TE1", salary: 5000, game: "Game1", projection: "NA"},
                {position: "TE", name: "TE2", salary: 5000, game: "Game2", projection: "NA"},
                {position: "TE", name: "TE3", salary: 5000, game: "Game3", projection: "NA"},
                {position: "TE", name: "TE4", salary: 50000, game: "Game4", projection: "NA"},
                {position: "TE", name: "TE5", salary: 5000, game: "Game5", projection: "NA"}
            ];

            var testdefense = [
                {position: "D", name: "D1", salary: 5000, game: "Game1", projection: "NA"},
                {position: "D", name: "D2", salary: 5000, game: "Game2", projection: "NA"},
                {position: "D", name: "D3", salary: 5000, game: "Game3", projection: "NA"},
                {position: "D", name: "D4", salary: 5000, game: "Game4", projection: "NA"},
                {position: "D", name: "D5", salary: 5000, game: "Game5", projection: "NA"}
            ];

            $scope.populateData = function () {
                $scope.populated = true;
                testqbs.forEach(function (value) {
                    $scope.qbs.push(value);
                });

                testrbs.forEach(function (value) {
                    $scope.rbs.push(value);
                });

                testwrs.forEach(function (value) {
                    $scope.wrs.push(value);
                });

                testtes.forEach(function (value) {
                    $scope.tes.push(value);
                });

                testdefense.forEach(function (value) {
                    $scope.defense.push(value);
                });
            };

            //$scope.qbs = [{position: "QB", name: "", salary: "", game: "", projection: ""}];
            //$scope.rbs = [{position: "RB", name: "", salary: "", game: "", projection: ""}];
            //$scope.wrs = [{position: "WR", name: "", salary: "", game: "", projection: ""}];
            //$scope.tes = [{position: "TE", name: "", salary: "", game: "", projection: ""}];
            //$scope.defense = [{position: "D", name: "", salary: "", game: "", projection: ""}];

            $scope.addQB = function () {
                $scope.qbs.push({
                    name: "",
                    position: "QB",
                    game: "",
                    projection: "",
                    salary: ""
                });
                $scope.games = myService.getGames();
            };
            $scope.removeQB = function () {
                $scope.qbs.pop();
            };

            $scope.addWR = function () {
                $scope.wrs.push({
                    name: "",
                    position: "QB",
                    game: "",
                    projection: "",
                    salary: ""
                });
                $scope.games = myService.getGames();
            };
            $scope.removeWR = function () {
                $scope.wrs.pop();
            };

            $scope.addRB = function () {
                $scope.rbs.push({
                    name: "",
                    position: "RB",
                    game: "",
                    projection: "",
                    salary: ""
                });
                $scope.games = myService.getGames();
            };
            $scope.removeRB = function () {
                $scope.rbs.pop();
            };

            $scope.addTE = function () {
                $scope.tes.push({
                    name: "",
                    position: "TE",
                    game: "",
                    projection: "",
                    salary: ""
                });
                $scope.games = myService.getGames();
            };
            $scope.removeTE = function () {
                $scope.tes.pop();
            };

            $scope.addDEF = function () {
                $scope.defense.push({
                    name: "",
                    position: "TE",
                    game: "",
                    projection: "",
                    salary: ""
                });
                $scope.games = myService.getGames();
            };
            $scope.removeDEF = function () {
                $scope.defense.pop();
            };

            $scope.foo = myService.setPlayers({
                "qbs": $scope.qbs,
                "rbs": $scope.rbs,
                "wrs": $scope.wrs,
                "tes": $scope.tes,
                "defense": $scope.defense
            });

        }]);
})();