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


angular.module('blocks').controller('BlockCtrl',
    ['$scope', 'BlocksService', 'timestampFilter', 'amountTQTFilter', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile',
        '$uibModalInstance', 'params', 'Restangular', '$uibModal', 'searchTermFilter', 'quantityToShareFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'shareToQuantiyFilter', 'transactionIconSubTypeFilter',
        function ($scope, BlocksService, timestampFilter, amountTQTFilter, DTOptionsBuilder, DTColumnBuilder, $compile,
                  $uibModalInstance, params, Restangular, $uibModal, searchTermFilter, quantityToShareFilter,
                  numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter, transactionIconSubTypeFilter) {

            $scope.height = params.height;
            $scope.includeTransactions = params.includeTransactions;


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };


            $scope.transactions = [];

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('numbers')
                .withOption('serverSide', true)
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('paging', false)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    BlocksService.getBlockDetails($scope.height, $scope.includeTransactions)
                        .then(function (response) {
                            var convertedResponse = {'data': [response]};
                            callback({
                                'iTotalRecords': 1,
                                'iTotalDisplayRecords': 1,
                                'data': convertedResponse.data
                            });
                        });
                })
                .withDisplayLength(1)
                .withBootstrap();


            $scope.dtColumns = [
                DTColumnBuilder.newColumn('height').withTitle('Height').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-infinity btn-xs" ng-click="openDetailsModal(' +
                            data + ')">' + data + '</button>';
                    }),

                DTColumnBuilder.newColumn('block').withTitle('Block Id').notSortable(),
                DTColumnBuilder.newColumn('numberOfTransactions').withTitle('Transactions').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return getBlocksTxs(data);
                    }),
                DTColumnBuilder.newColumn('totalAmountTQT').withTitle('Amount').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(data));
                    }),
                DTColumnBuilder.newColumn('totalFeeTQT').withTitle('Fee').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(data));
                    }),
                DTColumnBuilder.newColumn('generatorRS').withTitle('Generator').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('payloadLength').withTitle('Payload').notSortable(),
                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    ),

                DTColumnBuilder.newColumn('previousBlock').withTitle('Previous Block').withOption('defaultContent', ' ')
                    .notSortable(),


            ];

            $scope.dtOptionsTransactions = DTOptionsBuilder.newOptions()
                .withDOM('frtip')
                .withPaginationType('numbers')
                .withOption('serverSide', false)
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    BlocksService.getBlockDetails($scope.height, $scope.includeTransactions)
                        .then(function (response) {
                            callback({
                                'iTotalRecords': response.transactions.length,
                                'iTotalDisplayRecords': response.transactions.length,
                                'data': response.transactions
                            });
                        });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtColumnsTransactions = [
                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var details = '<a type="button" class="btn btn-infinity btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' + '<i class="fa fa-list-ul" aria-hidden="true"></i>'  + '</a>';
                        return  details;
                    }),

                DTColumnBuilder.newColumn('type').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                      return transactionIconSubTypeFilter(data, row.subtype);
                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Timestamp').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    ),
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
                    .withOption('defaultContent', ' ')
                    .renderWith(function (data, type, row, meta) {
                        if (data) {
                            return searchTermFilter(data);
                        }
                        return data;
                    }),
                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .withOption('defaultContent', ' ').renderWith(function (data, type, row, meta) {
                    if (data) {
                        return searchTermFilter(data);
                    }
                    return data;
                }),


            ];

            $scope.dtInstanceCallbackTransactions = {};

            function getBlocksTxs(value) {

                if (value === 0) {

                    return '<span class="label label-default">' + value + '</span>';

                } else if (value > 0 && value < 100) {

                    return '<span class="label label-success">' + value + '</span>';

                } else if (value >= 100 && value < 200) {

                    return '<span class="label label-warning">' + value + '</span>';

                } else if (value >= 200) {

                    return '<span class="label label-danger">' + value + '</span>';

                }

            }


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

            $scope.showBlockDetails = function () {
                BlocksService.getBlockDetails(params.blockDetails, false)
                    .then(function (response) {
                        $scope.blockDetails = Restangular.stripRestangular(response);
                    });

            };

            $scope.convertCamelToRegular = function (text) {
                var result = text.replace(/([A-Z])/g, ' $1');
                return result.charAt(0).toUpperCase() + result.slice(1);
            };

            $scope.openDetailsModal = function (data) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'blocks/block-details.html',
                    size: 'lg',
                    controller: 'BlockCtrl',
                    windowClass: 'block-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'blockDetails': data,
                            };
                        }
                    }
                });
            };

            $scope.generateSearchLink = function (searchTerm) {
                var accountHtml = '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + searchTerm +
                    '\')">' +
                    searchTerm + '</a>';
                return accountHtml;
            };

            $scope.generateNumberOfTxsHtml = function (number) {
                return getBlocksTxs(number);
            };
        }]
);
