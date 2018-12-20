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


angular.module('currency').controller('CurrenciesCtrl',
    ['$scope', 'CurrencyService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'baseConfig', 'amountTQTFilter', 'amountTKNFilter', 'supplyFilter', 'searchTermFilter', 'quantityToShareFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'shareToQuantiyFilter',
        function ($scope, CurrencyService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  baseConfig, amountTQTFilter, amountTKNFilter, supplyFilter, searchTermFilter, quantityToShareFilter,
                  numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('currencies')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    CurrencyService.getCurrencies(data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'currencies': response.currencies
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('currency').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Assets Issuance details"';

                        return '<button type="button" class="btn btn-infinity btn-xs"  ' + tt_info + ' ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('code').withTitle('Code').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a type="button" class="pointer" ng-click="openModal(\'' + data.toUpperCase() + '\')">' + data + '</a>';
                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable(),

                DTColumnBuilder.newColumn('accountRS').withTitle('Issuer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('currentSupply').withTitle('Supply').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, row.decimals));
                    }),

                DTColumnBuilder.newColumn('numberOfExchanges').withTitle('Exchanges').notSortable(),

                DTColumnBuilder.newColumn('numberOfTransfers').withTitle('Transfers').notSortable(),

                DTColumnBuilder.newColumn('currency').withTitle('View').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_trades = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Exchanges"';

                        var tt_transfer = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Transfers"';

                        var trades = '<button type="button" class="btn btn-default btn-xs" ' + tt_trades + ' ng-click="openCurrencyExchanges(\'' + data + '\',\'' + row.decimals + '\')">' +
                            '<i class="fa fa-bar-chart" aria-hidden="true"></i>' + '</button>';

                        var transfers = '<button type="button"class="btn btn-default btn-xs ' + tt_transfer + ' " ng-click="openCurrencyTransfer(\'' + data + '\',\'' + row.decimals + '\')">' +
                            '<i class="fa fa-user" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                        return trades + '&nbsp;' + transfers;


                    }),


            ];

            $scope.openModal = function (currency) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/currency.html',
                    size: 'lg',
                    controller: 'CurrencyCtrl',
                    windowClass: 'currency-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'currency': currency,
                                'includeCounts': true
                            };
                        }
                    }

                });

            };

            $scope.openCurrencyExchanges = function (currency, decimals) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/currency-exchange.html',
                    size: 'lg',
                    controller: 'CurrencyExchangeCtrl',
                    windowClass: 'currency-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'currency': currency,
                                'decimals': decimals
                            };
                        }
                    }

                });
            };

            $scope.openCurrencyTransfer = function (currency, decimals) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'currencies/currency-transfer.html',
                    size: 'lg',
                    controller: 'CurrencyTransferCtrl',
                    windowClass: 'currency-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'currency': currency,
                                'decimals': decimals
                            };
                        }
                    }

                });
            };

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadCurrencies = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('currency').controller('CurrencyCtrl',
    ['$scope', 'CurrencyService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$uibModalInstance', 'params',
        function ($scope, CurrencyService, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModalInstance, params) {

            $scope.currencyId = params.currency;
            $scope.includeCounts = params.includeCounts;

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.loadDetails = function () {
                CurrencyService.getCurrency($scope.currencyId, $scope.includeCounts).then(function (response) {
                    $scope.currencyDetails = response;
                });
            };

            $scope.generateSearchLink = function (searchTerm) {
                var accountHtml = '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + searchTerm +
                    '\')">' +
                    searchTerm + '</a>';
                return accountHtml;
            };

        }]
);

angular.module('currency').controller('CurrencyExchangeCtrl',
    ['$scope', 'CurrencyService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$uibModalInstance', 'params',
        'amountTKNFilter', 'timestampFilter', 'amountTQTFilter', 'searchTermFilter', 'quantityToShareFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'shareToQuantiyFilter',
        function ($scope, CurrencyService, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModalInstance, params,
                  amountTKNFilter, timestampFilter, amountTQTFilter, searchTermFilter, quantityToShareFilter,
                  numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter) {
            $scope.currency = params.currency;
            $scope.decimals = params.decimals;

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('exchanges')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    CurrencyService.getExchanges($scope.currency, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'exchanges': response.exchanges
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [


                DTColumnBuilder.newColumn('offer').withTitle('Details').notSortable()

                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Exchange Details"';

                        return '<button type="button" class="btn btn-infinity btn-xs"  ' + tt_info + ' ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"  style="width:15px;"  ></i>' + '</button>';

                    }),


                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),


                DTColumnBuilder.newColumn('rateTQT').withTitle('Rate').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(data));
                    }),
                DTColumnBuilder.newColumn('units').withTitle('Units').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, $scope.decimals));
                    }),
                DTColumnBuilder.newColumn('buyerRS').withTitle('Buyer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('sellerRS').withTitle('Seller').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

            ];

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]
);

angular.module('currency').controller('CurrencyTransferCtrl',
    ['$scope', 'CurrencyService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$uibModalInstance', 'params',
        'amountTKNFilter', 'timestampFilter', 'searchTermFilter', 'quantityToShareFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'shareToQuantiyFilter',
        function ($scope, CurrencyService, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModalInstance, params,
                  amountTKNFilter, timestampFilter, searchTermFilter, quantityToShareFilter,
                  numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter) {
            $scope.currency = params.currency;
            $scope.decimals = params.decimals;

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('transfers')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    CurrencyService.getTransfers($scope.currency, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'transfers': response.transfers
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('transfer').withTitle('Details').notSortable()

                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Transfer Details"';

                        return '<button type="button" class="btn btn-infinity btn-xs"  ' + tt_info + ' ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"  style="width:15px;"  ></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('units').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, $scope.decimals));
                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),


                DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),


            ];

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]
);
