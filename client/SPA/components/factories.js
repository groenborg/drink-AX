(function () {

    var app = angular.module('EX.factories', []);


    app.factory("controllerFactory", ['storageFactory', 'webserviceFactory', function (storageFactory, webserviceFactory) {

        return {

            updateKitchenData: function (callback) {

                webserviceFactory.getKitchenGroups(function (err, data) {
                    if (err) {
                        return callback(err);
                    }
                    for (var i = 0; i < 3; ++i) {
                        var kitchenNumber = data.data[i]._id;
                        var residentList = data.data[i].residents;
                        storageFactory.storeKitchens(kitchenNumber, residentList);
                    }
                    callback(undefined, data);
                });
            },
            onLoad: function (scope, kitchenNumber) {

                if (storageFactory.getKitchen(1).length == 0 &&
                    storageFactory.getKitchen(2).length == 0 &&
                    storageFactory.getKitchen(3).length == 0) {
                    this.updateKitchenData(function (err, data) {
                        if (err) {
                            scope.err = "No residents found"
                        } else {
                            scope.kitchenResidents = storageFactory.getKitchen(kitchenNumber);
                        }
                    });

                } else {
                    scope.kitchenResidents = storageFactory.getKitchen(kitchenNumber);

                }
            }
        }

    }]);

    app.factory('storageFactory', [function () {

        var kitchenGroup = {
            one: [],
            two: [],
            three: []
        };

        var getNumberInString = function (number) {
            switch (parseInt(number)) {
                case 1:
                    return "one";
                case 2:
                    return "two";
                case 3:
                    return "three";
            }
        };

        return {
            getKitchen: function (number) {
                return kitchenGroup[getNumberInString(number)];
            },
            storeKitchens: function (kitchenNumber, residents) {
                kitchenGroup[getNumberInString(kitchenNumber)] = residents;
            },
            getResident: function (kitchenNumber, residentId) {
                var number = getNumberInString(kitchenNumber);
                for (var i = 0; i < kitchenGroup[number].length; ++i) {
                    if (kitchenGroup[number][i].resident_id == residentId) {
                        return kitchenGroup[number][i];
                    }
                }
            },
            savePreferredKitchen: function (key, value) {
                window.localStorage.setItem(key, value)
            },
            clearPreferredKitchen: function () {

            }
        }
    }]);

    app.factory('adminFactory', ['webserviceFactory', function (webserviceFactory) {
        return {

            onLoadTransactions: function (errorProperty, dataProperty, scope, callback) {
                webserviceFactory.getAllAssortmentItems(function (err, data) {
                    if (err) {
                        return scope[errorProperty] = {error: "An error occured"};
                    }
                    scope[dataProperty] = data.data;
                    if (callback) return callback();
                });
            }
        }
    }]);


    app.factory('webserviceFactory', ['$http', function ($http) {

        return {
            getAllResidents: function (callback) {
                $http({
                    method: 'GET',
                    url: 'api/getResidents'
                }).then(function success(response) {
                    callback(undefined, response);
                }, function error(response) {
                    callback(response);
                });
            },
            getKitchenGroups: function (callback) {
                $http({
                    method: 'GET',
                    url: '/api/getKitchenGroups'
                }).then(function success(response) {
                    callback(undefined, response);
                }, function error(response) {
                    callback(response);
                });
            },
            purchaseTransaction: function (purchase, callback) {
                $http({
                    method: 'POST',
                    url: '/api/user/purchase',
                    data: purchase
                }).then(function success(response) {
                    callback(undefined, response);
                }, function error(response) {
                    callback(response);
                });
            },
            getAllAssortmentItems: function (callback) {
                $http({
                    method: 'GET',
                    url: '/api/assortment/all'
                }).then(function success(data) {
                    callback(undefined, data)
                }, function error(data) {
                    callback(data)
                });
            }
        }
    }]);

})();



