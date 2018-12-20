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


angular.module('distributions').controller('DistributionsCtrl',
    ['$scope', 'DistributionService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'baseConfig', 'numericalStringFilter', 'quantToAmountFilter',
        function ($scope, DistributionService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  baseConfig, numericalStringFilter, quantToAmountFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                                              .withDOM('frtip')
                                              .withOption('responsive', true)
                                              .withOption('ordering', false)
                                              .withOption('info', false)
                                              .withOption('serverSide', false)
                                              .withDataProp('balances')
                                              .withOption('paging', true)
                                              .withOption('processing', true)
                                              .withOption('bFilter', false)
                                              .withOption('fnRowCallback',
                                                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                                        $compile(nRow)($scope);
                                                    })
                                                .withOption('ajax', function (data, callback, settings) {
                                                    var endIndex = data.start + data.length - 1;
                                                    DistributionService.getDistributions(data.start, endIndex).then(function (response) {
                                                        callback({
                                                            'iTotalRecords': 1000,
                                                            'iTotalDisplayRecords': 1000,
                                                            'balances': response.balances
                                                        });
                                                    });
                                                })
                                                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('accountRS').withTitle('Account').notSortable()
                               .renderWith(function (data, type, row, meta) {
                                   return '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + data +
                                       '\')">' +
                                       data + '</a>';
                               }),
                DTColumnBuilder.newColumn('balanceTQT').withTitle('Balance').notSortable()
                               .renderWith(function (data, type, row, meta) {
                                   return numericalStringFilter(quantToAmountFilter(data));
                               }),
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadBalances = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

            $scope.dtDistributionOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                                                .withDOM('frtip')
                                                .withOption('responsive', true)
                                                .withOption('ordering', false)
                                                .withOption('info', false)
                                                .withOption('serverSide', false)
                                                .withDataProp('distributions')
                                                .withOption('paging', true)
                                                .withOption('processing', false)
                                                .withOption('bFilter', false)
                                                .withOption('fnRowCallback',
                                                      function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                                          $compile(nRow)($scope);
                                                      })
                                                .withOption('ajax', function (data, callback, settings) {
                                                    var endIndex = data.start + data.length - 1;
                                                    DistributionService.getDistributions(data.start,
                                                        endIndex, true, 1000, 9 * 1000000000 * 100000000, 10)
                                                                       .then(function (response) {
                                                                           callback({
                                                                               'iTotalRecords': response.distributions.length,
                                                                               'iTotalDisplayRecords': response.distributions.length,
                                                                               'distributions': response.distributions
                                                                           });
                                                                       });
                                                  })
                                                  .withDisplayLength(10).withBootstrap();

            $scope.dtDistributionColumns = [
                DTColumnBuilder.newColumn('distributionStart').withTitle('From')
                               .renderWith(function (data, type, row, meta) {
                                   return quantToAmountFilter(data);
                               }),
                DTColumnBuilder.newColumn('distributionEnd').withTitle('To')
                               .renderWith(function (data, type, row, meta) {
                                   return (quantToAmountFilter(data));
                               }),
                DTColumnBuilder.newColumn('distribution').withTitle('#')
                               .renderWith(function (data, type, row, meta) {
                                   return (data);
                               }),
            ];

            $scope.dtDistributionInstanceCallback = function (_dtInstance) {
                $scope.dtDistributionInstance = _dtInstance;
            };
            $scope.reloadDistributions = function () {
                if ($scope.dtDistributionInstance) {
                    $scope.dtDistributionInstance._renderer.rerender();
                }
            };

        }
    ]);
