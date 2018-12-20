/******************************************************************************
 * Copyright © 2017 XEL Community                                             *
 *                                                                            *
 * See the DEVELOPER-AGREEMENT.txt and LICENSE.txt files at  the top-level    *
 * directory of this distribution for the individual copyright  holder        *
 * information and the developer policies on copyright and licensing.         *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * XXEL software, including this file, may be copied, modified, propagated,    *
 * or distributed except according to the terms contained in the LICENSE.txt  *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/


angular.module('assets').controller('AssetsCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder',
        '$interval', '$uibModal', '$compile', 'baseConfig', 'supplyFilter', 'searchTermFilter', 'quantityToShareFilter',
        'numericalStringFilter', 'quantToAmountFilter',
        function ($scope, AssetsService, amountTQTFilter, timestampFilter, DTOptionsBuilder, DTColumnBuilder, $interval,
                  $uibModal, $compile, baseConfig, supplyFilter, searchTermFilter, quantityToShareFilter,
                  numericalStringFilter, quantToAmountFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('assets')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getAssets(data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'assets': response.assets
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('asset').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Assets Issuance details"';

                        return '<button type="button" class="btn btn-infinity btn-xs"  ' + tt_info + ' ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a type="button" class="pointer"  ng-click="openModal(\'' + row.asset + '\')">' + data.toUpperCase() + '</a>';
                    }),
                DTColumnBuilder.newColumn('quantityQNT').withTitle('Supply').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, row.decimals));
                    }),
                DTColumnBuilder.newColumn('numberOfAccounts').withTitle('Shareholders').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('numberOfTrades').withTitle('Trades').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('numberOfTransfers').withTitle('Transfers').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),
                DTColumnBuilder.newColumn('accountRS').withTitle('Issuer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),
                DTColumnBuilder.newColumn('asset').withTitle('View').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_trades = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Trades"';

                        var tt_transfer = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Transfers"';

                        var trades = '<button type="button" class="btn btn-default btn-xs" ' + tt_trades + ' ng-click="openAssetTrades(\'' + data + '\')">' +
                            '<i class="fa fa-bar-chart" aria-hidden="true"></i>' + '</button>';

                        var transfers = '<button type="button" class="btn btn-default btn-xs ' + tt_transfer + ' " ng-click="openAssetTransfers(\'' + data + '\')">' +
                            '<i class="fa fa-user" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                        return trades + '&nbsp;' + transfers;


                    }),
            ];

            $scope.openModal = function (asset) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/asset.html',
                    size: 'lg',
                    controller: 'AssetCtrl',
                    windowClass: 'asset-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'asset': asset,
                                'includeCounts': true
                            };
                        }
                    }

                });
            };

            $scope.openAssetTrades = function (assetId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/asset-trades.html',
                    size: 'lg',
                    controller: 'AssetTradeCtrl',
                    windowClass: 'asset-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'assetId': assetId,
                            };
                        }
                    }

                });
            };

            $scope.openAssetTransfers = function (assetId) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/asset-transfers.html',
                    size: 'lg',
                    controller: 'AssetTransferCtrl',
                    windowClass: 'asset-modal-window',
                    resolve: {
                        params: function () {
                            return {
                                'assetId': assetId,
                            };
                        }
                    }

                });
            };

            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadAssets = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };

        }]);

angular.module('assets').controller('AssetCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile',
        '$uibModalInstance', 'params', 'supplyFilter',
        function ($scope, AssetsService, amountTQTFilter, DTOptionsBuilder, DTColumnBuilder, $compile,
                  $uibModalInstance, params, supplyFilter) {

            $scope.asset = params.asset;
            $scope.includeCounts = params.includeCounts;

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.loadDetails = function () {
                AssetsService.getAsset($scope.asset, $scope.includeCounts)
                    .then(function (response) {
                        $scope.assetDetails = response;

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

angular.module('assets').controller('AssetTradeCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile',
        '$uibModalInstance', 'params', 'amountTKNFilter', 'timestampFilter', 'supplyFilter',
        'searchTermFilter', 'quantityToShareFilter', 'numericalStringFilter', 'quantToAmountFilter',
        'shareToQuantiyFilter', 'buysellFilter',
        function ($scope, AssetsService, amountTQTFilter, DTOptionsBuilder, DTColumnBuilder, $compile,
                  $uibModalInstance, params, amountTKNFilter, timestampFilter, supplyFilter,
                  searchTermFilter, quantityToShareFilter, numericalStringFilter, quantToAmountFilter,
                  shareToQuantiyFilter, buysellFilter) {
            $scope.assetId = params.assetId;

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('serverSide', true)
                .withDataProp('trades')
                .withOption('processing', true)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    AssetsService.getTrades($scope.assetId, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'trades': response.trades
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [


                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),

                DTColumnBuilder.newColumn('priceTQT').withTitle('Price').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(shareToQuantiyFilter(data, row.decimals)));
                    }),


                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, row.decimals));
                    }),

                DTColumnBuilder.newColumn('askOrder').withTitle('Ask').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Ask Order Details"';

                        return '<button type="button" class="btn btn-infinity btn-xs"  ' + tt_info + ' ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('bidOrder').withTitle('Bid').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Bid Order Details"';

                        return '<button type="button" class="btn btn-infinity btn-xs"  ' + tt_info + ' ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('sellerRS').withTitle('Seller').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('buyerRS').withTitle('Buyer').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('tradeType').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return buysellFilter(data);
                    }),


            ];

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }]
);

angular.module('assets').controller('AssetTransferCtrl',
    ['$scope', 'AssetsService', 'amountTQTFilter', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile',
        '$uibModalInstance', 'params', 'supplyFilter', 'amountTKNFilter', 'timestampFilter',
        'searchTermFilter', 'quantityToShareFilter', 'numericalStringFilter', 'quantToAmountFilter',
        'shareToQuantiyFilter',
        function ($scope, AssetsService, amountTQTFilter, DTOptionsBuilder, DTColumnBuilder, $compile,
                  $uibModalInstance, params, supplyFilter, amountTKNFilter, timestampFilter,
                  searchTermFilter, quantityToShareFilter, numericalStringFilter, quantToAmountFilter,
                  shareToQuantiyFilter) {
            $scope.assetId = params.assetId;

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
                    AssetsService.getTransfers($scope.assetId, data.start, endIndex).then(function (response) {
                        callback({
                            'iTotalRecords': 1000,
                            'iTotalDisplayRecords': 1000,
                            'transfers': response.transfers
                        });
                    });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [

                DTColumnBuilder.newColumn('assetTransfer').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Transfer Details"';

                        return '<button type="button" class="btn btn-infinity btn-xs"  ' + tt_info + ' ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return timestampFilter(data);
                    }),

                DTColumnBuilder.newColumn('quantityQNT').withTitle('Quantity').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantityToShareFilter(data, row.decimals));
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
