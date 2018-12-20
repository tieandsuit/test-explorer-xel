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


angular.module('accounts').controller('AccountsCtrl',
    ['$scope', 'AccountService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'baseConfig',
        function ($scope, AccountService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  baseConfig) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withOption('serverSide', true)
                .withDataProp('accounts')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    AccountService.getAccounts(data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'accounts': response.accounts
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('accountRS').withTitle('Account').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + data + '\')">' +
                            data + '</a>';
                    }),
                DTColumnBuilder.newColumn('accountName').withTitle('Name').notSortable(),
                DTColumnBuilder.newColumn('accountDescription').withTitle('Description').notSortable()
            ];

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };
            $scope.reloadAccounts = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }
    ]);
