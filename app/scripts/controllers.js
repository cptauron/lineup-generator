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
                    flex: $scope.selectedO,
                    generatedPicks: false,
                    lineups: [{
                        criteraMet: true,
                        rb1: "test",
                        rb2: "test",
                        wr1: "test",
                        wr2: "test",
                        wr3: "test",
                        te: "test",
                        def: "test"
                    }]
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
        .controller('MyCtrl2', ['$scope', 'myService', function ($scope, myService) {

            var salaryCap = 50000;

            $scope.stacks = myService.getStacks();
            $scope.lineupCount = 0;
            var newPools = {
                rbs: myService.getPlayerSlot('rbs'),
                wrs: myService.getPlayerSlot('wrs'),
                tes: myService.getPlayerSlot('tes'),
                defense: myService.getPlayerSlot('defense')
            };

            $scope.checkDuplicate = function(array) {
                //returns True if the array has a duplicate
                var sorted_array = array.sort();
                for (var i = 0; i < array.length - 1; i++) {
                    if (sorted_array[i + 1] == sorted_array[i]) {
                        return true;
                    }
                }
                return false;
            };

            $scope.generatePicks = function (index) {
                $scope.stacks[index].generatedPicks = true;
                var lineupHolder = [];
                //loop through players
                for (var a = 0, alength = newPools.rbs.length; a < alength; a++) {
                    for (var b = 0, blength = newPools.rbs.length; b < blength; b++) {
                        for (var c = 0, clength = newPools.wrs.length; c < clength; c++) {
                            for (var d = 0, dlength = newPools.wrs.length; d < dlength; d++) {
                                for (var e = 0, elength = newPools.wrs.length; e < elength; e++) {
                                    for (var f = 0, flength = newPools.tes.length; f < flength; f++) {
                                        for (var g = 0, glength = newPools.defense.length; g < glength; g++) {
                                            lineupHolder.push(
                                                {
                                                    criteraMet: true,
                                                    totalSalary: 0,
                                                    salaries: [],
                                                    rb1: newPools.rbs[a],
                                                    rb2: newPools.rbs[b],
                                                    wr1: newPools.wrs[c],
                                                    wr2: newPools.wrs[d],
                                                    wr3: newPools.wrs[e],
                                                    te: newPools.tes[f],
                                                    def: newPools.defense[g]
                                                }
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                console.log(lineupHolder.length);

                var falsecount = 0;
                var dupeGames = 0;
                var dupePlayers = 0;
                var overSalary = 0;
                for (var i = 0; i < lineupHolder.length; i++) {

                    var salaries = [
                        Number($scope.stacks[index].qb.salary),
                        Number($scope.stacks[index].flex.salary),
                        Number(lineupHolder[i].rb1.salary),
                        Number(lineupHolder[i].rb2.salary),
                        Number(lineupHolder[i].wr1.salary),
                        Number(lineupHolder[i].wr2.salary),
                        Number(lineupHolder[i].wr3.salary),
                        Number(lineupHolder[i].te.salary),
                        Number(lineupHolder[i].def.salary)
                    ];



                    //QB = QB stack in this check, assuming flex and qb share games
                    var games = [
                        $scope.stacks[index].qb.game,
                        lineupHolder[i].rb1.game,
                        lineupHolder[i].rb2.game,
                        lineupHolder[i].wr1.game,
                        lineupHolder[i].wr2.game,
                        lineupHolder[i].wr3.game,
                        lineupHolder[i].te.game,
                        lineupHolder[i].def.game
                    ];

                    var names = [
                        $scope.stacks[index].qb.name,
                        $scope.stacks[index].flex.name,
                        lineupHolder[i].rb1.name,
                        lineupHolder[i].rb2.name,
                        lineupHolder[i].wr1.name,
                        lineupHolder[i].wr2.name,
                        lineupHolder[i].wr3.name,
                        lineupHolder[i].te.name,
                        lineupHolder[i].def.name
                    ];


                    //Check each critera only if previous still met (true) to save performance time
                    //Salary
                    var lineupSalary = 0;
                    var invalidNumbers = 0;
                    if(lineupHolder[i].criteraMet == true) {
                        for (var k = 0; k < salaries.length; k++) {
                            lineupSalary += salaries[k];
                        }
                        lineupHolder[i].salaries = salaries;
                        lineupHolder[i].totalSalary = lineupSalary;

                        if (lineupSalary > salaryCap) {
                            lineupHolder[i].criteraMet = false;
                            falsecount++;
                            overSalary++;
                        }
                    }
                    //Duplicate games
                    if(lineupHolder[i].criteraMet == true) {
                        if($scope.checkDuplicate(games)) {
                            lineupHolder[i].criteraMet = false;
                            falsecount++;
                            dupeGames++;
                        }
                    }

                    //Duplicate Players
                    if(lineupHolder[i].criteraMet == true) {
                        if ($scope.checkDuplicate(names)) {
                            lineupHolder[i].criteraMet = false;
                            falsecount++;
                            dupePlayers++;
                        }
                    }

                }
                console.log(falsecount + " - " + dupePlayers + " - " + dupeGames + " - " + overSalary + " - " + invalidNumbers);

                var splicecount = 0;
                for(var j = lineupHolder.length-1; j >= 0; j--){
                    if (lineupHolder[j].criteraMet == false) {
                        lineupHolder.splice(j, 1);
                        splicecount++;
                    }
                }
                console.log(lineupHolder);
                $scope.stacks[index].lineups = lineupHolder;
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
                {position: "QB", name: "Andrew Luck", salary: 8800, game: "IND@PIT", projection: "22.4"},
                {position: "QB", name: "Tom Brady", salary: 7200, game: "CHI@NE", projection: "18.8"},
                {position: "QB", name: "Jay Cutler", salary: 8300, game: "CHI@NE", projection: "18.5"}
            ];

            var testrbs = [
                {position: "RB", name: "Mark Ingram", salary: 4300, game: "GB@NO", projection: "15.6"},
                {position: "RB", name: "Shane Vereen", salary: 6200, game: "CHI@NE", projection: "17.6"},
                {position: "RB", name: "Darren McFadden", salary: 4700, game: "OAK@CLE", projection: "14.5"},
                {position: "RB", name: "Jerick McKinnon", salary: 4900, game: "MIN@TB", projection: "15"}
            ];

            var testwrs = [
                {position: "WR", name: "Julian Edelman", salary: 4600, game: "CHI@NE", projection: "33.7"},
                {position: "WR", name: "Dwayne Bowe", salary: 3600, game: "STL@KC", projection: "12.1"},
                {position: "WR", name: "Jarvis Landry", salary: 3500, game: "MIA@JAX", projection: "11.3"},
                {position: "WR", name: "Doug Baldwin", salary: 4700, game: "SEA@CAR", projection: "14.9"}
            ];

            var testtes = [
                {position: "TE", name: "Jordan Reed", salary: 4000, game: "WAS@DAL", projection: "12.6"},
                {position: "TE", name: "Jared Cook", salary: 3400, game: "STL@KC", projection: "10.4"},
                {position: "TE", name: "Travis Kelce", salary: 3800, game: "STL@KC", projection: "11.3"},
                {position: "TE", name: "Dwayne Allen", salary: 3900, game: "IND@PIT", projection: "11.5"}
            ];

            var testdefense = [
                {position: "D", name: "Dolphins", salary: 3300, game: "MIA@JAX", projection: "13"},
                {position: "D", name: "Chiefs", salary: 2800, game: "STL@KC", projection: "10.9"},
                {position: "D", name: "Jets", salary: 2800, game: "BUF@NJ", projection: "10.6"},
                {position: "D", name: "Cowboys", salary: 3000, game: "WAS@DAL", projection: "9"}
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