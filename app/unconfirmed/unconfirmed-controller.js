angular.module('unconfirmedTransactions').controller('UnconfirmedTransactionsCtrl',
    ['$scope', 'UnconfirmedTransactionsService', 'baseConfig', 'unconfirmedTransactionsConfig', 'amountTQTFilter',
        'timestampFilter', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$uibModal', '$compile',
        'searchTermFilter', 'quantityToShareFilter', 'numericalStringFilter', 'quantToAmountFilter',
        'shareToQuantiyFilter', 'transactionIconSubTypeFilter',
        function ($scope, UnconfirmedTransactionsService, baseConfig, unconfirmedTransactionsConfig, amountTQTFilter,
                  timestampFilter, DTOptionsBuilder, DTColumnBuilder, $interval, $uibModal, $compile, searchTermFilter,
                  quantityToShareFilter, numericalStringFilter, quantToAmountFilter, shareToQuantiyFilter, transactionIconSubTypeFilter) {

            $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('numbers')
            .withDOM('frtip')
            .withOption('paging', true)
            .withOption('ordering', false)
            .withOption('info', false)
                .withOption('serverSide', false)
                .withDataProp('unconfirmedTransactions')
                .withOption('paging', true)
                .withOption('ordering', false)
                .withOption('processing', false)
                .withOption('bFilter', false)
                .withOption('fnRowCallback',
                    function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        $compile(nRow)($scope);
                    })
                .withOption('ajax', function (data, callback, settings) {
                    UnconfirmedTransactionsService.getUnconfirmedTransactions()
                        .then(function (response) {
                            callback({
                                'iTotalRecords': response.unconfirmedTransactions.length,
                                'iTotalDisplayRecords': response.unconfirmedTransactions.length,
                                'unconfirmedTransactions': response.unconfirmedTransactions
                            });
                        });
                })
                .withDisplayLength(10).withBootstrap();

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('transaction').withTitle('Details').notSortable()
                  .renderWith(function (data, type, row, meta) {
                      var details = '<a type="button" class="btn btn-infinity btn-xs" ng-controller="SearchCtrl"' +
                          ' ng-click="searchValue(\'' + data+ '\')">' + '<i class="fa fa-list-ul" aria-hidden="true"></i>'  + '</a>';
                      return  details;
                  }),

                DTColumnBuilder.newColumn('type').withTitle('Type').notSortable()
                  .renderWith(function (data, type, row, meta) {
                    return transactionIconSubTypeFilter(data, row.subtype);
                  }),

                DTColumnBuilder.newColumn('senderRS').withTitle('Sender').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('recipientRS').withTitle('Recipient').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return searchTermFilter(data);
                    }),

                DTColumnBuilder.newColumn('recipientRS').withTitle('Conf.').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return '<span class="label label-default">0</span>';
                    }),
                DTColumnBuilder.newColumn('feeTQT').withTitle('Fee').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(data));
                    }),
                DTColumnBuilder.newColumn('amountTQT').withTitle('Amount').notSortable()
                    .renderWith(function (data, type, row, meta) {
                        return numericalStringFilter(quantToAmountFilter(data));
                    }),
                DTColumnBuilder.newColumn('timestamp').withTitle('Date').notSortable()
                    .renderWith(function (data, type, row, meta) {
                            return timestampFilter(data);
                        }
                    )
            ];


            $scope.dtInstanceCallback = function (_dtInstance) {
                $scope.dtInstance = _dtInstance;
            };

            $scope.reloadUnconfirmedTransactions = function () {
                if ($scope.dtInstance) {
                    $scope.dtInstance._renderer.rerender();
                }
            };
        }]);
