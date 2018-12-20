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

angular.module('transactions').controller('TransactionsCtrl',
        ['$scope', 'TransactionsService', 'baseConfig', 'transactionsConfig', 'amountTQTFilter',
            'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
            'searchTermFilter', 'quantityToShareFilter', 'numericalStringFilter', 'quantToAmountFilter',
            'shareToQuantiyFilter', 'transactionIconSubTypeFilter',
            function ($scope, TransactionsService, baseConfig, transactionsConfig, amountTQTFilter, timestampFilter,
                      DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile, searchTermFilter,
                      quantityToShareFilter, numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter,
                      transactionIconSubTypeFilter ) {

                $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                    .withOption('serverSide', true)
                    .withDataProp('transactions')
                    .withOption('processing', true)
                    .withOption('bFilter', false)
                    .withOption('fnRowCallback',
                        function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            $compile(nRow)($scope);
                        })
                    .withOption('ajax', function (data, callback, settings) {
                        var endIndex = data.start + data.length - 1;
                        TransactionsService.getTransactions(
                            data.start,
                            endIndex
                          )
                            .then(function (response) {
                                callback({
                                    'iTotalRecords': 1000,
                                    'iTotalDisplayRecords': 1000,
                                    'transactions': response.transactions
                                });
                            });
                    })
                    .withDisplayLength(10).withBootstrap();

                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('Id').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var details = '<a type="button" class="btn btn-infinity btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + row.fullHash + '\')">' + '<i class="fa fa-list-ul" aria-hidden="true"></i>'  + '</a>';
                        return  details;
                    }),
                    DTColumnBuilder.newColumn('type').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                      return transactionIconSubTypeFilter(data, row.subtype);
                      }),
                    DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                        .renderWith(function (data, type, row, meta) {
                                return timestampFilter(data);
                          }),
                    DTColumnBuilder.newColumn('amountTQT').withTitle('Amount').notSortable()
                        .renderWith(function (data, type, row, meta) {
                            return numericalStringFilter(quantToAmountFilter(data));
                        }),
                    DTColumnBuilder.newColumn('feeTQT').withTitle('Fee').notSortable()
                        .renderWith(function (data, type, row, meta) {
                            return numericalStringFilter(quantToAmountFilter(data));
                        }),
                    DTColumnBuilder.newColumn('confirmations').withTitle('Conf.').notSortable()
                        .renderWith(function (data, type, row, meta) {
                                return getTransactionConf(data);
                            }
                        ),
                    DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                        .renderWith(function (data, type, row, meta) {

                          if (row.senderId === '0') {
                            return '';
                          }

                            return searchTermFilter(data);
                        }),
                    DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                        .renderWith(function (data, type, row, meta) {
                            return searchTermFilter(data);
                        })
                ];

                function getTransactionConf(value) {

                    if (value === 0) {

                        return '<span class="label label-default">' + value + '</span>';

                    } else if (value > 0 && value < 10) {

                        return '<span class="label label-danger">' + value + '</span>';

                    } else if (value >= 10 && value < 100) {

                        return '<span class="label label-warning">' + value + '</span>';

                    } else if (value >= 100 && value < 720) {

                        return '<span class="label label-success">' + value + '</span>';

                    } else {

                        return '<span class="label label-success">+720</span>';

                    }

                }

                function getTransactionTypeGlyphicon(value) {
                    switch (value) {
                        case 0:
                            return 'glyphicon-usd';
                        case 1:
                            return 'glyphicon-envelope';
                        case 2:
                            return 'glyphicon-signal';
                        case 3:
                            return 'glyphicon-shopping-cart';
                        case 4:
                            return 'glyphicon-info-sign';
                        case 5:
                            return 'glyphicon-random';
                        case 6:
                            return 'glyphicon-save';
                        case 7:
                            return 'glyphicon-link';
                    }
                }

                $scope.dtInstanceCallback = function (_dtInstance) {
                    $scope.dtInstance = _dtInstance;
                };

                $scope.reloadTransactions = function () {
                    if ($scope.dtInstance) {
                        $scope.dtInstance._renderer.rerender();
                    }
                };
            }]);
