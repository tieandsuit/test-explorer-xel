/******************************************************************************
 * Copyright © 2017 XEL Community                                             *
 *                                                                            *
 * See the DEVELOPER-AGREEMENT.txt and LICENSE.txt files at  the top-level    *
 * directory of this distribution for the individual copyright  holder        *
 * information and the developer policies on copyright and licensing.         *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * XEL software, including this file, may be copied, modified, propagated,    *
 * or distributed except according to the terms contained in the LICENSE.txt  *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/


angular.module('stats')
    .controller('StatsCtrl',
        ['$scope', 'StatsService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile', 'baseConfig',
            function ($scope, StatsService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile, baseConfig) {

                $scope.initialSupply = baseConfig.initialSupply;
                $scope.circulatingSupply = baseConfig.initialSupply;

                StatsService.getBalance( baseConfig.genesisAccount ).then(function (response) {

                  $scope.circulatingSupplyTKN = (response.balanceTQT/100000000) * -1;

                  $scope.circulatingSupply = $scope.circulatingSupplyTKN||baseConfig.initialSupply;

                });

                $scope.stats = {};

                $scope.getStats = function () {
                    StatsService.getStats().then(function (response) {
                        $scope.stats = response;
                    });
                };
            }]);
