(function () {
    'use strict';

    /* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
    angular.module('myApp.services', [])
        .value('version', '0.1')
        .factory('myService', function () {

            var stacks = [];

            var property = {
                "qbs":[],
                "rbs":[],
                "wrs":[],
                "tes":[],
                "defense":[]
            };


            var lineups = [];

            return {
                getLineups: function () {
                    return lineups;
                },
                getRBPool: function (index) {
                    return lineup[index].rbPool;
                },
                getPlayers: function () {
                    return property;
                },
                setPlayers: function (value) {
                    property = value;
                },
                getGames: function () {
                    var games = [];
                    var temp = [property.qbs, property.rbs, property.wrs, property.tes, property.defense];
                    if (temp.length > 0) {
                        temp.forEach(function (value, index) {
                            if (value) {
                                value.forEach(function (value, index) {
                                    if (typeof value.game != 'undefined') {
                                        games.push(value.game);
                                    }
                                });
                            }
                        });
                    }
                    var uniq = games.slice()
                        .sort(function (a, b) {
                            return a - b;
                        })
                        .reduce(function (a, b) {
                            if (a.slice(-1)[0] !== b) a.push(b);
                            return a;
                        }, []);

                    return uniq;
                },
                getQbs: function () {
                    return property.qbs;
                },
                getOffense: function () {
                    return property.wrs.concat(property.rbs.concat(property.tes));
                },
                getPlayerSlot: function (slot) {
                    return property[slot];
                },
                setStacks: function (stack) {
                    stack.push(stack);
                },
                getStacks: function () {
                    return stacks;
                }
            };
        });
})();