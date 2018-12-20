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


angular.module('search').controller('SearchCtrl',
    ['$scope', 'SearchService', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'searchConfig', '$q', 'votingModelFilter',
        function ($scope, SearchService, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile,
                  searchConfig, $q, votingModelFilter) {

            $scope.showSearchBar = false;

            var errorHandler = function (errorMessage) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'search/search-error.html',
                    size: 'sm',
                    controller: 'ErrorSearchCtrl',

                    resolve: {
                        params: function () {
                            return {
                                message: errorMessage
                            };
                        }
                    }
                });
            };

            $scope.searchValue = function (searchTerm) {
                if (searchTerm) {
                    if (searchTerm.startsWith(searchConfig.searchAccountString)) {
                        SearchService.searchAccounts(searchTerm).then(function (response) {
                                if (!response.errorCode) {
                                    var result = $uibModal.open({
                                        animation: true,
                                        templateUrl: 'search/search-account-result.html',
                                        size: 'lg',
                                        controller: 'AccountSearchCtrl',
                                        windowClass: 'block-modal-window',
                                        resolve: {
                                            params: function () {
                                                return {
                                                    account: response,
                                                    accountId: searchTerm
                                                };
                                            }
                                        },

                                    });
                                } else {
                                    errorHandler(searchTerm + ' account doesn\'t exists ');
                                }
                            }
                        );
                    } else if (!isNaN(searchTerm)) {
                        var blockHeightSearch = SearchService.searchBlocks(searchTerm);
                        var blockIdSearch = SearchService.searchBlockById(searchTerm);
                        var transactionSearch = SearchService.searchTransactionById(searchTerm);
                        $q.all([blockHeightSearch, blockIdSearch, transactionSearch]).then(function (results) {
                            var resultSize = results.length;
                            for (var i = 0; i < resultSize; i++) {
                                var response = results[i];
                                if (!response.errorCode) {
                                    if (!response.transaction) {
                                        $uibModal.open({
                                            animation: true,
                                            templateUrl: 'blocks/block.html',
                                            size: 'lg',
                                            controller: 'BlockCtrl',
                                            windowClass: 'block-modal-window',
                                            resolve: {
                                                /* jshint ignore:start */
                                                params: function () {
                                                    return {
                                                        'height': response.height,
                                                        'includeTransactions': true
                                                    };
                                                }
                                                /* jshint ignore:end */
                                            }
                                        });
                                        break;
                                    } else {
                                        $uibModal.open({
                                            animation: true,
                                            templateUrl: 'search/search-transaction-result.html',
                                            size: 'lg',
                                            controller: 'TransactionSearchCtrl',
                                            windowClass: 'block-modal-window ',
                                            resolve: {
                                                /* jshint ignore:start */
                                                params: function () {
                                                    return {
                                                        'transaction': response
                                                    };
                                                }
                                                /* jshint ignore:end */
                                            }
                                        });
                                        break;
                                    }
                                }
                            }
                            if (resultSize === 0) {
                                errorHandler(searchTerm + ' Block or transaction doesn\'t exists ');
                            }
                        });
                    } else {
                        SearchService.searchTransactions(searchTerm).then(function (response) {
                            if (!response.errorCode) {

                                $uibModal.open({
                                    animation: true,
                                    templateUrl: 'search/search-transaction-result.html',
                                    size: 'lg',
                                    controller: 'TransactionSearchCtrl',
                                    windowClass: 'block-modal-window ',
                                    resolve: {
                                        params: function () {
                                            return {
                                                'transaction': response
                                            };
                                        }
                                    }
                                });
                            } else {

                              // Add modal for error messages

                              errorHandler(searchTerm + ' is not valid account, block or transaction');

                            }
                        });
                    }
                }

            };

            $scope.search = function () {
                var searchTerm = $scope.searchTerm;
                $scope.searchValue(searchTerm);
            };
        }]
);

angular.module('search').controller('AccountSearchCtrl',
    ['$scope', 'DTOptionsBuilder', 'TransactionsService', 'timestampFilter', 'amountTQTFilter', 'amountTKNFilter',
        'isEmptyFilter', 'DTColumnBuilder', '$compile', '$uibModalInstance', '$q', 'params', 'AccountService',
        'supplyFilter', 'votingModelFilter', 'currencyModelFilter', 'searchTermFilter', 'quantityToShareFilter',
        'numericalStringFilter', 'quantToAmountFilter', 'shareToQuantiyFilter', 'transactionIconSubTypeFilter',
        'isEnabledFilter',
        function ($scope, DTOptionsBuilder, TransactionsService, timestampFilter, amountTQTFilter, amountTKNFilter,
                  isEmptyFilter, DTColumnBuilder, $compile, $uibModalInstance, $q, params, AccountService,
                  supplyFilter, votingModelFilter, currencyModelFilter, searchTermFilter,
                  quantityToShareFilter, numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter,
                  transactionIconSubTypeFilter, isEnabledFilter) {


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.showResult = function () {
                $scope.account = params.account;
                $scope.accountRs = params.account.accountRS;
            };

            $scope.qrCode = function () {
                $scope.accountRs = params.account.accountRS;
            };


            $scope.dtOptionsTransactions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('serverSide', true)
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('responsive', true)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('info', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    var endIndex = data.start + data.length - 1;
                    TransactionsService.getTransactionsOfAccount(params.accountId, data.start, endIndex)
                        .then(function (response) {
                            callback({
                                'iTotalRecords': 1000,
                                'iTotalDisplayRecords': 1000,
                                'data': response.transactions
                            });
                        });
                })
                .withDisplayLength(5).withBootstrap();

            $scope.dtColumnsTransactions = [

                DTColumnBuilder.newColumn('transaction').withTitle('Id').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        var details = '<a type="button" class="btn btn-infinity btn-xs" ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' + '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</a>';
                        return details;
                    }),
                DTColumnBuilder.newColumn('type').withTitle('Type').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return transactionIconSubTypeFilter(data, row.subtype);
                    }),
                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
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

            $scope.dtInstanceCallbackTransactions = {};

            $scope.dtOptionsAssets = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('accountAssets')
                .withOption('paging', true)
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    AccountService.getAccountAssets(params.accountId).then(function (response) {
                        callback({
                            'iTotalRecords': response.accountAssets.length,
                            'iTotalDisplayRecords': response.accountAssets.length,
                            'accountAssets': response.accountAssets
                        });
                    });
                })
                .withDisplayLength(3).withBootstrap();

            $scope.dtColumnsAssets = [
                DTColumnBuilder.newColumn('asset').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Assets Issuance details"';

                        return '<button type="button" class="btn btn-infinity btn-xs"  ' + tt_info + ' ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('name').withTitle('Ticker').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a  class="pointer" style="width: 80%" ng-controller="AssetsCtrl" ng-click="openModal(\'' + row.asset + '\')">' + data.toUpperCase() + '</a>';
                    }),
                DTColumnBuilder.newColumn('quantityQNT').withTitle('Holding').notSortable()
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
                DTColumnBuilder.newColumn('asset').withTitle('View').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_trades = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Trades"';

                        var tt_transfer = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Transfers"';

                        var trades = '<button type="button" class="btn btn-default btn-xs" ' + tt_trades + 'ng-controller="AssetsCtrl" ng-click="openAssetTrades(\'' + data + '\')">' +
                            '<i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                        var transfers = '<button type="button" class="btn btn-default btn-xs" ' + tt_transfer + ' ng-controller="AssetsCtrl" ng-click="openAssetTransfers(\'' + data + '\')">' +
                            '<i class="fa fa-user" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                        return trades + '&nbsp;' + transfers;


                    }),
            ];

            $scope.dtInstanceCallbackAssets = {};

            $scope.dtOptionsCurrencies = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('accountCurrencies')
                .withOption('paging', true)
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    AccountService.getAccountCurrencies(params.accountId).then(function (response) {
                        callback({
                            'iTotalRecords': response.accountCurrencies.length,
                            'iTotalDisplayRecords': response.accountCurrencies.length,
                            'accountCurrencies': response.accountCurrencies
                        });
                    });
                })
                .withDisplayLength(3).withBootstrap();

            $scope.dtColumnsCurrencies = [
                DTColumnBuilder.newColumn('currency').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Currency Issuance details"';

                        return '<button type="button" class="btn btn-infinity btn-xs"  ' + tt_info + ' ng-controller="SearchCtrl"' +
                            ' ng-click="searchValue(\'' + data + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('code').withTitle('Code').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<a  class="pointer" ng-controller="CurrenciesCtrl" ng-click="openModal(\'' + data.toUpperCase() + '\')">' + data + '</a>';
                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable(),


                DTColumnBuilder.newColumn('unconfirmedUnits').withTitle('Supply').notSortable()
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

                        var trades = '<button type="button" class="btn btn-default btn-xs" ' + tt_trades + ' ng-controller="CurrenciesCtrl" ng-click="openCurrencyExchanges(\'' + data + '\',\'' + row.decimals + '\')">' +
                            '<i class="fa fa-bar-chart" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                        var transfers = '<button type="button" class="btn btn-default btn-xs" ' + tt_transfer + ' ng-controller="CurrenciesCtrl" ng-click="openCurrencyTransfer(\'' + data + '\',\'' + row.decimals + '\')">' +
                            '<i class="fa fa-user" aria-hidden="true" style="width:15px;"></i>' + '</button>';

                        return trades + '&nbsp;' + transfers;

                    }),

            ];

            $scope.dtInstanceCallbackCurrencies = {};

            $scope.dtOptionsPolls = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('polls')
                .withOption('paging', true)
                .withOption('info', false)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    AccountService.getAccountPolls(params.accountId).then(function (response) {
                        callback({
                            'iTotalRecords': response.polls.length,
                            'iTotalDisplayRecords': response.polls.length,
                            'polls': response.polls
                        });
                    });
                })
                .withDisplayLength(3).withBootstrap();

            $scope.dtColumnsPolls = [
                DTColumnBuilder.newColumn('offer').withTitle('Details').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        var tt_info = ' popover-placement="bottom" popover-trigger="\'mouseenter\'" uib-popover=' +
                            ' "Poll Details"';

                        return '<button type="button" class="btn btn-infinity btn-xs" style="" ng-controller="PollsCtrl" ng-click="openModal(\'' + row.poll + '\')">' +
                            '<i class="fa fa-list-ul" aria-hidden="true"></i>' + '</button>';

                    }),

                DTColumnBuilder.newColumn('name').withTitle('Name').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data;
                    }),

                DTColumnBuilder.newColumn('votingModel').withTitle('Model').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return votingModelFilter(data);
                    }),

                DTColumnBuilder.newColumn('options').withTitle('Options').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return data.length;
                    }),
                DTColumnBuilder.newColumn('finished').withTitle('Finished').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return isEnabledFilter(data);
                    }),

                DTColumnBuilder.newColumn('finishHeight').withTitle('Height').notSortable(),

                DTColumnBuilder.newColumn('poll').withTitle('View').notSortable()
                    .renderWith(function (data, type, row, meta) {

                        return '<button type="button" class="btn btn-default btn-xs" ng-controller="PollsCtrl" ng-click="openPollData(\'' + data +
                            '\',\'' + row.name + '\',\'' + row.description + '\')">  <i class="fa fa-bar-chart" aria-hidden="true"></i> </a>';
                    }),
            ];

            $scope.dtInstanceCallbackPolls = {};

            $scope.dtOptionsAliases = DTOptionsBuilder.newOptions().withPaginationType('numbers')
                .withDOM('frtip')
                .withOption('serverSide', false)
                .withDataProp('aliases')
                .withOption('info', false)
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false).withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    AccountService.getAccountAliases(params.accountId).then(function (response) {
                        callback({
                            'iTotalRecords': response.aliases.length,
                            'iTotalDisplayRecords': response.aliases.length,
                            'aliases': response.aliases
                        });
                    });
                })
                .withDisplayLength(3).withBootstrap();

            $scope.dtColumnsAliases = [
                DTColumnBuilder.newColumn('aliasName').withTitle('Name').notSortable(),
                DTColumnBuilder.newColumn('aliasURI').withTitle('URI').notSortable(),
            ];

            $scope.dtInstanceCallbackAliases = {};


        }]);

angular.module('search').controller('TransactionSearchCtrl',
    ['$scope', 'Restangular', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', '$uibModalInstance', '$q', 'params',
        'searchTermFilter', 'quantityToShareFilter', 'numericalStringFilter', 'quantToAmountFilter',
        'shareToQuantiyFilter',
        function ($scope, Restangular, DTOptionsBuilder, DTColumnBuilder, $compile, $uibModalInstance, $q, params,
                  searchTermFilter,
                  quantityToShareFilter, numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter) {


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.showResult = function () {
                $scope.transaction = Restangular.stripRestangular(params.transaction);
            };

            $scope.convertCamelToRegular = function (text) {
                var result = text.replace(/([A-Z])/g, ' $1');
                return result.charAt(0).toUpperCase() + result.slice(1);
            };

            $scope.generateSearchLink = function (searchTerm) {
                var accountHtml = '<a href="" ng-controller="SearchCtrl" ng-click="searchValue(\'' + searchTerm +
                    '\')">' +
                    searchTerm + '</a>';
                return accountHtml;
            };

            $scope.getTransactionConf = function (value) {

                if (value === 0) {

                    return '<span class="label label-default">' + value + '</span>';

                } else if (value > 0 && value < 10) {

                    return '<span class="label label-danger">' + value + '</span>';

                } else if (value >= 10 && value < 100) {

                    return '<span class="label label-warning">' + value + '</span>';

                } else if (value >= 100 && value < 720) {

                    return '<span class="label label-success">' + value + '</span>';

                } else {

                    return '<span class="label label-primary">' + value + '</span>';

                }

            };

            $scope.getTransactionTypeGlyphicon = function (value) {
                switch (value) {
                    case 0:
                        return '<span class="glyphicon ' + 'glyphicon-usd' + ' " aria-hidden="true"></span>';
                    case 1:
                        return '<span class="glyphicon ' + 'glyphicon-envelope' + ' " aria-hidden="true"></span>';
                    case 2:
                        return '<span class="glyphicon ' + 'glyphicon-signal' + ' " aria-hidden="true"></span>';
                    case 3:
                        return '<span class="glyphicon ' + 'glyphicon-shopping-cart' + ' " aria-hidden="true"></span>';
                    case 4:
                        return '<span class="glyphicon ' + 'glyphicon-info-sign' + ' " aria-hidden="true"></span>';
                    case 5:
                        return '<span class="glyphicon ' + 'glyphicon-random' + ' " aria-hidden="true"></span>';
                    case 6:
                        return '<span class="glyphicon ' + 'glyphicon-save' + ' " aria-hidden="true"></span>';
                    case 7:
                        return '<span class="glyphicon ' + 'glyphicon-link' + ' " aria-hidden="true"></span>';
                }
            };

        }]);

angular.module('search').controller('ErrorSearchCtrl', ['$scope', '$uibModalInstance', '$q', 'params',
    function ($scope, $uibModalInstance, $q, params) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.showResult = function () {
            $scope.message = params.message;
        };
    }]);
